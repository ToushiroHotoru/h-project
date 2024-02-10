const bcrypt = require("bcryptjs");

const User = require("./User.schema");
const Avatar = require("../avatar/Avatar.schema");
const TokenService = require("../../service/Token.service");
const LINK = require("../../utils/API_URL");

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
          status: "warning",
          message: "Пользователь с таким именем пользователя уже существует",
        });
      }

      if (candidateWithEmail) {
        return reply.code(200).send({
          status: "warning",
          message: "Пользователь с такой почтой уже существует",
        });
      }

      const passwordHash = bcrypt.hashSync(password, this.bcryptSalt);

      await User.register({
        email,
        username,
        password: passwordHash,
      });

      reply.code(200).send({
        status: "success",
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
        return reply.code(404).send({
          success: false,
          message: "Пользователь с такой почтой не обнаружен",
        });
      }

      const compareSync = bcrypt.compareSync(password, user.password);

      if (!compareSync) {
        return reply.code(404).send({
          success: false,
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
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
              id: user._id,
              userName: user.username,
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
          .code(401)
          .send({ success: false, message: "Не авторизованы", code: 401 });
      }
      const verifiedToken = await TokenService.verifyRefreshToken(refreshToken);

      if (!verifiedToken) {
        return reply
          .code(401)
          .send({ success: false, message: "Invalid refresh" });
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
            accessToken: tokens.accessToken,
            user: {
              id: userData._id,
              userName: userData.username,
            },
          },
        });
    } catch (error) {
      reply.code(401).send({ status: "error", errors: error });
    }
  }

  async userProfile(request, reply) {
    try {
      const userDB = await User.findOne({ username: request.query.username })
        .select(["username", "email", "preferencesTags", "exceptionsTags"])
        .lean();

      if (!userDB) {
        return reply.code(404).send({
          message: "Пользователь с таким никнеймом не найден",
          status: "warning",
        });
      }

      reply.code(200).send({ status: "success", data: { user: userDB } });
    } catch (error) {
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
}

module.exports = new UserController();
