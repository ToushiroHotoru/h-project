const { model, Schema } = require("mongoose");

const MangaSchema = new Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    artist: { type: String, required: true },
    series: { type: String, required: true },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
        required: true,
      },
    ],
    likes: { type: Number, required: true, default: 0 },
    views: { type: Number, required: true, default: 0 },
    cycle: {
      name: { type: String },
      part: { type: Number },
    },
    pages: { type: Array, required: true },
  },
  { timestamps: true }
);

MangaSchema.statics.add = function (data) {
  return this.create(data);
};

MangaSchema.statics.getAllMangasId = function () {
  return this.find({}).select("_id");
};

MangaSchema.statics.sortByTime = function (offset, step, tags) {
  if (!tags) {
    return this.find({})
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(step)
      .populate("tags")
      .exec();
  }
  if (Array.isArray(tags)) {
    return this.find({ tags: { $all: [...tags] } })
      .sort({ createdAt: "desc" })
      .skip(offset)
      .limit(step)
      .populate("tags")
      .exec();
  }
  return this.find({ tags: tags })
    .sort({ createdAt: "desc" })
    .skip(offset)
    .limit(step)
    .populate("tags")
    .exec();
};

MangaSchema.statics.sortByAlphabet = function (offset, step, tags) {
  if (!tags) {
    return this.find({})
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 })
      .skip(offset)
      .limit(step)
      .populate("tags")
      .exec();
  }
  if (Array.isArray(tags)) {
    return this.find({ tags: { $all: [...tags] } })
      .collation({ locale: "en", strength: 2 })
      .sort({ title: 1 })
      .skip(offset)
      .limit(step)
      .populate("tags")
      .exec();
  }
  return this.find({ tags: tags })
    .collation({ locale: "en", strength: 2 })
    .sort({ title: 1 })
    .skip(offset)
    .limit(step)
    .populate("tags")
    .exec();
};

MangaSchema.statics.getStaticFields = function (id) {
  return this.findById(id).select([
    "title",
    "cover",
    "artist",
    "series",
    "cycle",
  ]);
};

MangaSchema.statics.getDynamicFields = function (id) {
  return this.findById(id)
    .select(["-title", "-cover", "-artist", "-series", "-cycle"])
    .populate({
      path: "tags",
    })
    .exec();
};

module.exports = model("Manga", MangaSchema);
