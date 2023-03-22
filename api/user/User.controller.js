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
