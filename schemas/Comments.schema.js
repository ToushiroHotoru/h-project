const { Schema, model } = require("mongoose");

const CommentsSchema = new Schema(
  {
    text: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    manga: {
      type: Schema.Types.ObjectId,
      ref: "Manga",
    },
    answersFor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamp: true }
);

CommentsSchema.statics.addComment = function ({ text, mangaId, userId }) {
  return this.create({
    text: text,
    user: userId,
    manga: mangaId,
  });
};

module.exports = model("Comments", CommentsSchema);
