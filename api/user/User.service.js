const bcrypt = require("bcryptjs");

const User = require("./User.model");
const Avatar = require("../avatar/Avatar.model");
const TokenService = require("../../service/Token.service");
const LINK = require("../../utils/API_URL");
const RoleModel = require("../role/Role.model");

class UserController {
  constructor() {
    this.bcryptSalt = 8;
  }
  async registerUser(request, reply) {
    try {
      const { email, username, password } = request.body;
      const candidateWithUsername = await User.findOne({
        username: username,
      }).lean();
      const candidateWithEmail = await User.findOne({ email: email }).lean();

      if (candidateWithUsername) {
        return reply.code(200).send({
          status: "error",
          data: {},
          message: "Пользователь с таким именем пользователя уже существует",
        });
      }

      if (candidateWithEmail) {
        return reply.code(200).send({
          status: "error",
          data: {},
          message: "Пользователь с такой почтой уже существует",
        });
      }

      const passwordHash = bcrypt.hashSync(password, this.bcryptSalt);

      const registeredUser = await User.register({
        email,
        username,
        password: passwordHash,
      });

      reply.code(200).send({
        status: "success",
        data: {
          id: registeredUser._id,
        },
        message: "",
      });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async loginUser(request, reply) {
    try {
      const { email, password } = request.body;
      const user = await User.findOne({ email: email }).lean();
      if (!user) {
        return reply.code(200).send({
          status: "error",
          message: "Пользователь с такой почтой не обнаружен",
        });
      }

      const compareSync = bcrypt.compareSync(password, user.password);

      if (!compareSync) {
        return reply.code(200).send({
          status: "error",
          message: "Неправильный пароль",
        });
      }

      const avatar = await Avatar.findById(user.avatar);

      const payload = {
        user: user._id,
        userType: user.userType,
        userName: user.username,
      };
      const tokens = TokenService.generateTokens(payload);
      await TokenService.saveToken(user._id, tokens.refreshToken, "");
      reply
        .setCookie("refreshToken", tokens.refreshToken, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
        })
        .code(200)
        .send({
          status: "success",
          data: {
            user: {
              accessToken: tokens.accessToken,
              id: user._id,
              name: user.username,
              avatar: LINK + avatar.image,
            },
          },
        });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async logoutUser(request, reply) {
    try {
      const refreshToken = request.cookies.refreshToken;
      const verifiedToken = await TokenService.verifyRefreshToken(refreshToken);
      await TokenService.removeRefreshToken(verifiedToken.user, refreshToken);
      reply
        .clearCookie("refreshToken", {
          path: "/",
        })
        .code(200)
        .send({ status: "success" });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async refresh(request, reply) {
    try {
      const refreshToken = request.cookies.refreshToken;
      if (!refreshToken) {
        return reply
          .code(403)
          .send({ status: "error", message: "Не авторизованы" });
      }
      const verifiedToken = await TokenService.verifyRefreshToken(refreshToken);

      if (verifiedToken.error) {
        return reply
          .code(403)
          .send({ status: "error", message: "Invalid refresh" });
      }

      const userData = await User.findOne({ _id: verifiedToken.user });

      const tokenFromDb = await TokenService.findToken(
        verifiedToken.user,
        refreshToken
      );

      if (!tokenFromDb) {
        return reply
          .code(401)
          .send({ success: false, message: "Token not found" });
      }

      const tokens = await TokenService.refresh({
        user: verifiedToken.user,
        refreshToken: refreshToken,
        payload: {
          user: userData._id,
          userType: userData.userType,
          userName: userData.username,
        },
      });

      const avatar = await Avatar.findById(userData.avatar);

      reply
        .setCookie("refreshToken", tokens.refreshToken, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
        })
        .code(200)
        .send({
          status: "success",
          data: {
            user: {
              accessToken: tokens.accessToken,
              id: userData._id,
              name: userData.username,
              avatar: LINK + avatar.image,
            },
          },
        });
    } catch (error) {
      reply.code(401).send({ status: "error", errors: error });
    }
  }

  async userProfile(request, reply) {
    try {
      let userDB = await User.findOne({ username: request.query.username })
        .select([
          "username",
          "email",
          "preferencesTags",
          "exceptionsTags",
          "avatar",
          "createdAt",
        ])
        .populate({
          path: "avatar",
          select: "image",
        })
        .populate({
          path: "role",
          select: "roleRu",
        });

      userDB = JSON.parse(JSON.stringify(userDB));

      if (!userDB) {
        return reply.code(200).send({
          data: {},
          status: "error",
          message: "Пользователь с таким никнеймом не найден",
        });
      }

      if (userDB.avatar?.image) {
        userDB = {
          ...userDB,
          avatar: { ...userDB.avatar, image: LINK + userDB.avatar?.image },
        };
      }

      reply.code(200).send({ status: "success", data: { user: userDB } });
    } catch (error) {
      console.log(error);
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async getAllUsers(request, reply) {
    try {
      const users = await User.allUsers();
      reply.code(200).send({ status: "success", data: { users } });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async setPreferencesTags(request, reply) {
    try {
      const { tags, id } = request.body;
      if (tags.length) {
        await User.setPreferencesTags({ tags, id });
      }
      reply.code(200).send({ status: "success" });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async setExceptionsTags(request, reply) {
    try {
      const { tags, id } = request.body;
      await User.setExceptionsTags({ tags, id });
      reply.code(200).send({ status: "success" });
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }

  async setAvatar(request, reply) {
    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === "file" && part.fields.isUpload.value) {
          const result = await Avatar.addUserAvatar(part, part.fields.id.value);
          await User.setAvatar({
            avatar: result._id.toString(),
            id: part.fields.id.value,
          });
        } else {
          await User.setAvatar({
            avatar: part.fields.avatar.value,
            id: part.fields.id.value,
          });
        }
      }
      reply.code(200);
    } catch (error) {
      reply.code(500).send({ status: "error", errors: error });
    }
  }
  async roleSet(reply) {
    await RoleModel.addRole();
    reply.code(200);
  }
  async checkIsOnline(request, reply) {
    try {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.code(403).send({ status: "error", message: "Forbidden" });
      }

      const isRefreshTokenValid = await TokenService.verifyRefreshToken(
        refreshToken
      );

      if (isRefreshTokenValid.error) {
        return reply.code(403).send({ status: "error", message: "Forbidden" });
      }

      const accessToken = request.headers.authorization
        ? request.headers.authorization.split(" ")[1]
        : null;

      if (!accessToken)
        return reply
          .code(401)
          .send({ status: "error", message: "Unauthorized" });

      const isAccessTokenValid = await TokenService.verifyAccessToken(
        accessToken
      );

      if (isAccessTokenValid.error) {
        return reply
          .code(401)
          .send({ status: "error", message: "Unauthorized" });
      }

      reply.code(200).send({ status: "success", message: "user online" });
    } catch (error) {}
  }

  async decodeJwt(request, reply) {
    try {
      const { token } = request.body;
      const decodedToken = TokenService.verifyAccessToken(token);
      reply.code(200).send(decodedToken);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new UserController();
