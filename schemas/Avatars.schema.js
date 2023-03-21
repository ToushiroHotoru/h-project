const { Schema, model } = require("mongoose");
const path = require("path");
const fs = require("fs");
const util = require("util");
const { pipeline } = require("stream");
const pump = util.promisify(pipeline);

const AvatarSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "user",
  },
});

AvatarSchema.statics.appendAvatar = async function (file) {
  let timestamps = Date.now();
  let newName = timestamps.toString() + "_" + file.filename;
  await pump(
    file.file,
    fs.createWriteStream(
      path.resolve(__dirname, `../public/avatars/${newName}`)
    )
  );
  return this.create({
    image: path.join(`/public/avatars/${newName}`),
  });
};

module.exports = model("Avatar", AvatarSchema);
