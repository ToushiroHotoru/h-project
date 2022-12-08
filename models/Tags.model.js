const { model, Schema } = require("mongoose");
const os = require("os");

const defaultTagsImages = [
  "/public/tags/tags_default_1.jpg",
  "/public/tags/tags_default_2.jpg",
  "/public/tags/tags_default_3.jpg",
];

const tagsSchema = new Schema({
  image: {
    type: String,
    default: function () {
      return (
        os.hostname() +
        defaultTagsImages[Math.floor(Math.random() * defaultTagsImages.length)]
      );
    },
  },
  name: { type: String, required: true },
  description: { type: String },
  count: { type: Number, default: 0 },
});

tagsSchema.statics.add = function (name, image = "", description = "") {
  this.create(name, image, description);
};

module.exports = model("Tags", tagsSchema);
