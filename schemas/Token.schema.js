const { Schema, model } = require("mongoose");

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tokens: {
    type: Array,
  },
});

module.exports = model("Token", TokenSchema);
