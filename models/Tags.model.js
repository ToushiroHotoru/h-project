const { model, Schema } = require("mongoose");

const defaultTagsImages = [
  "/public/tags/tags_default_1.jpg",
  "/public/tags/tags_default_2.jpg",
  "/public/tags/tags_default_3.jpg",
];
const defaultTagsImagesMini = [
  "/public/tags/mini_tags_default_1.jpg",
  "/public/tags/mini_tags_default_2.jpg",
  "/public/tags/mini_tags_default_3.jpg",
];

const tagsSchema = new Schema({
  image: {
    type: String,
    default: function () {
      return defaultTagsImages[
        Math.floor(Math.random() * defaultTagsImages.length)
      ];
    },
  },
  miniImage: {
    type: String,
    default: function () {
      return defaultTagsImagesMini[
        Math.floor(Math.random() * defaultTagsImagesMini.length)
      ];
    },
  },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  count: { type: Number, default: 0 },
});

tagsSchema.statics.add = function (name, image = "", description = "") {
  return this.create({ name: name.toLowerCase() });
};

tagsSchema.statics.deleteAll = function (name, image = "", description = "") {
  return this.deleteMany({});
};

module.exports = model("Tags", tagsSchema);
