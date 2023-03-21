const User = require("../../schemas/User.schema");
const Avatar = require("../../schemas/Avatars.schema");

class UserController {
  async registerUser(request, reply) {
    try {
      const { email, username, password } = JSON.parse(request.body);
      const candidateWithUsername = await User.findOne({ username: username });
      const candidateWithEmail = await User.findOne({ email: email });

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

      const result = await User.register({
        email,
        username,
        password,
      });

      reply.code(200).send({
        success: true,
        message: "Вы успешно зарегистрировались",
        userId: result._id,
      });
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ success: false, message: err.message });
    }
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
      const data = await request.file();
      console.log(request.body)
      const file = data.fields.avatar;
      const userId = data.fields.id.value;
      const isUpload = data.fields.isUpload.value;
      if (!isUpload) {
        await User.setAvatar({ avatar: data.fields.avatar.value, userId });
      } else {
        const result = await Avatar.appendAvatar(file);
        await User.setAvatar({ avatar: result._id, userId });
      }
      reply.code(200);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }
}

module.exports = new UserController();
