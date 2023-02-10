const User = require("../../schemas/User.schema");

class UserController {
  async registerUser(request, reply) {
    try {
      const { email, username, password } = request.body;
      await User.register({ email, username, password });
      reply.code(200);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ error: err.message });
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
      const { preferencesTags, id } = request.body;
      await User.setPreferencesTags({ preferencesTags, id });
      reply.code(200);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send(err.message);
    }
  }
}

module.exports = new UserController();
