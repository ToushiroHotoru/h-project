const bcrypt = require("bcryptjs");

const User = require("../../schemas/User.schema");
const Avatar = require("../../schemas/Avatars.schema");
const TokenService = require("../../service/Token.service");

class UserController {
  constructor() {
    this.bcryptSalt = 8;
  }
  async registerUser(request, reply) {
    try {
      const { email, username, password } = JSON.parse(request.body);
      const candidateWithUsername = await User.findOne({
        username: username,
      }).lean();
      const candidateWithEmail = await User.findOne({ email: email }).lean();

      if (candidateWithUsername) {
        return reply.code(200).send({
          success: true,
          message: "Пользователь с таким именем пользователя уже существует",
        });
      }

      if (candidateWithEmail) {
        return reply.code(200).send({
          success: true,
          message: "Пользователь с такой почтой уже существует",
        });
      }

      const passwordHash = bcrypt.hashSync(password, this.bcryptSalt);

      const result = await User.register({
        email,
        username,
        password: passwordHash,
      });

      reply.code(200).send({
        success: true,
        message: "Вы успешно зарегистрировались",
        userId: result._id,
      });
    } catch (err) {
      reply.code(500).send({ success: false, message: err.message });
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
        })
        .code(200)
        .send({
          success: true,
          accessToken: tokens.accessToken,
          user: {
            id: user._id,
            userName: user.username,
          },
        });
    } catch (error) {
      reply.code(500).send({ success: false, message: error.message });
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
          httpOnly: true,
        })
        .code(200)
        .send({ success: true });
    } catch (error) {
      reply.code(500).send({ error: error });
    }
  }

  async refresh(request, reply) {
    try {
      const refreshToken = request.cookies.refreshToken;
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
        })
        .code(200)
        .send({
          accessToken: tokens.accessToken,
          user: {
            id: userData._id,
            userName: userData.username,
          },
        });
    } catch (error) {
      reply.code(500).send({ error: error });
    }
  }

  async userProfile(requst, reply) {
    const userDB = await User.findOne({ username: requst.query.username })
      .select(["username", "email", "preferencesTags", "exceptionsTags"])
      .lean();

    if (!userDB) {
      return reply.code(404).send({
        message: "Пользователь с таким никнеймом не найден",
        success: true,
      });
    }

    reply.code(200).send({ user: userDB });
  }

  async getAllUsers(request, reply) {
    try {
      const res = await User.allUsers();
      reply.code(200).send(res);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }

  async setPreferencesTags(request, reply) {
    try {
      const { preferencesTags, id } = JSON.parse(request.body);
      console.log(preferencesTags, id);
      if (preferencesTags.length) {
        await User.setPreferencesTags({ preferencesTags, id });
      }
      reply.code(200).send({ success: true });
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }

  async setExceptionsTags(request, reply) {
    try {
      const { exceptionsTags, id } = JSON.parse(request.body);
      await User.setExceptionsTags({ exceptionsTags, id });
      reply.code(200);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }

  async setAvatar(request, reply) {
    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === "file" && part.fields.isUpload.value) {
          const result = await Avatar.appendAvatar(part, part.fields.id.value);
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
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }
}

module.exports = new UserController();
