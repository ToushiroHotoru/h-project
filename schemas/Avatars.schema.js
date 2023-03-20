const { Schema, model } = require("mongoose");

const AvatarSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
});

module.exports = model("Avatar", AvatarSchema);
