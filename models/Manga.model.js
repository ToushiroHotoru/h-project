const { model, Schema } = require("mongoose");

const MangaSchema = new Schema(
  {
    title: { type: String, required: true },
    cover: { type: String, required: true },
    artist: { type: String, required: true },
    series: { type: String, required: true },
    tags: { type: Array, required: true },
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
  this.create(data);
};

// animalSchema.statics.findByName = function(name) {
//   return this.find({ name: new RegExp(name, 'i') });
// };

// title: <название>,
// cover: <путь до файла>,
// artist: <художник>,
// translator: <автор перевода>,
// series: <серия>,
// timestamp: <дата добавления>,
// tags: [ <тег 1>, <тег 2> ],
// likes:<кол-во лайков>,
// views: <кол-во просмотров> ,
// cycle: {
//     name: <название цикла>,
//     part: <номер главы>
// }

module.exports = model("Manga", MangaSchema);
