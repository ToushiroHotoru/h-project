const { Schema, model } = require("mongoose");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { pipeline } = require("stream");
const pump = util.promisify(pipeline);

const AvatarSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "user",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

AvatarSchema.statics.appendAvatar = async function (file, userId) {
  let timestamps = Date.now();
  let newName = timestamps.toString() + "_" + file.filename;
  await pump(
    file.file,
    fs.createWriteStream(
      path.resolve(__dirname, `../upload/user_avatars/${newName}`)
    )
  );
  return this.create({
    image: path.join(`/upload/user_avatars/${newName}`),
    userId: userId,
  });
};

module.exports = model("Avatar", AvatarSchema);
