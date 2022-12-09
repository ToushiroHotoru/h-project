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
      return defaultTagsImages[0];
    },
  },
  miniImage: {
    type: String,
    default: function () {
      return defaultTagsImagesMini[0];
    },
  },
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  count: { type: Number, default: 0 },
});

tagsSchema.statics.add = function (params) {
  const randowValue = Math.floor(Math.random() * defaultTagsImagesMini.length);
  if (!params.image) {
    params.image = defaultTagsImages[randowValue];
  }

  if (!params.miniImage) {
    params.miniImage = defaultTagsImagesMini[randowValue];
  }

  return this.create({
    name: params.name.toLowerCase(),
    image: params.image,
    miniImage: params.miniImage,
    description: params.description,
  });
};

tagsSchema.statics.deleteAll = function (name, image = "", description = "") {
  return this.deleteMany({});
};

module.exports = model("Tags", tagsSchema);
