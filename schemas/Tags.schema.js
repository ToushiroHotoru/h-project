const { model, Schema } = require("mongoose");
const commonTagsPath = "/public/tags/common/";
const miniTagsPath = "/public/tags/mini/";

const defaultTagsImages = [
  "tags_default_1.jpg",
  "tags_default_2.jpg",
  "tags_default_3.jpg",
];
const defaultTagsImagesMini = [
  "mini_tags_default_1.jpg",
  "mini_tags_default_2.jpg",
  "mini_tags_default_3.jpg",
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
    params.image = commonTagsPath + defaultTagsImages[randowValue];
  }

  if (!params.miniImage) {
    params.miniImage = miniTagsPath + defaultTagsImagesMini[randowValue];
  }

  return this.create({
    name: params.name.toLowerCase(),
    image: params.image,
    miniImage: params.miniImage,
    description: params.description,
  });
};

tagsSchema.statics.deleteAll = function () {
  return this.deleteMany({});
};

tagsSchema.statics.getAll = function () {
  return this.find({});
};

module.exports = model("Tags", tagsSchema);
