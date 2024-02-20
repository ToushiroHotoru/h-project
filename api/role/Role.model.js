const { Schema, model } = require("mongoose");

const roleTypes = [
  { role: "user", roleRu: "Пользователь" },
  { role: "admin", roleRu: "Админ" },
  { role: "moderator", roleRu: "Модератор" },
  { role: "translator", roleRu: "Переводчик" },
];

const roleSchema = new Schema({
  role: { type: String, default: "user" },
  roleRu: { type: String, default: "Пользователь" },
});

roleSchema.statics.addRole = function () {
  for (const role of roleTypes) {
    this.create({
      role: role.role,
      roleRu: role.roleRu,
    });
  }
};

module.exports = model("Role", roleSchema);
