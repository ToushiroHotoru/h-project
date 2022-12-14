const Manga = require("../schemas/Manga.schema");
const mongoose = require('mongoose');

const tags = ["63b2c36df0a695aa4ee12d27", "63b2c399f0a695aa4ee12d2a", "63b2c3d6f0a695aa4ee12d2c", "63b2c451f0a695aa4ee12d2e", "63b2c495f0a695aa4ee12d30", "63b2c4c4f0a695aa4ee12d32", "63b2c4f7f0a695aa4ee12d34", "63b2c5a4f0a695aa4ee12d36", "63b2c5d0f0a695aa4ee12d38"]

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const mangaSort = async (sort, offset, step, tag) => {
  let mangas = null;
  switch (sort) {
    case "latest":
      mangas = await Manga.sortByTime(offset, step, tag);
      break;
    case "alphabet":
      mangas = await Manga.sortByAlphabet(offset, step, tag);
      break;
    default:
      mangas = { message: "такого типа сортировки нет" };
      break;
  }

  return mangas;
};

const mangaAppendService = async () => {
  for (let i = 0; i < 72; i++) {
    await Manga.add({
      title: `Manga ${i + 1}`,
      cover: `/manga_cover/cover_${getRandomInt(7) + 1}.jpg`,
      artist: "Toushiro",
      series: "Toushiro's saga",
      tags: [mongoose.Types.ObjectId(tags[getRandomInt(9)]), mongoose.Types.ObjectId(tags[getRandomInt(9)]), mongoose.Types.ObjectId(tags[getRandomInt(9)])
      ],
      likes: getRandomInt(1000),
      views: getRandomInt(10000),
      cycle: {
        name: "Neverland",
        part: 1,
      },
      pages: [
        "/test_manga_storage/1.jpg",
        "/test_manga_storage/2.jpg",
        "/test_manga_storage/3.jpg",
        "/test_manga_storage/4.jpg",
        "/test_manga_storage/5.jpg",
        "/test_manga_storage/6.jpg",
        "/test_manga_storage/7.jpg",
        "/test_manga_storage/8.jpg",
        "/test_manga_storage/9.jpg",
        "/test_manga_storage/10.jpg",
        "/test_manga_storage/11.jpg",
        "/test_manga_storage/12.jpg",
        "/test_manga_storage/13.jpg",
        "/test_manga_storage/14.jpg",
        "/test_manga_storage/15.jpg",
        "/test_manga_storage/16.jpg",
        "/test_manga_storage/17.jpg",
        "/test_manga_storage/18.jpg",
        "/test_manga_storage/19.jpg",
        "/test_manga_storage/20.jpg",
        "/test_manga_storage/21.jpg",
        "/test_manga_storage/22.jpg",
        "/test_manga_storage/23.jpg",
        "/test_manga_storage/24.jpg",
      ],
    });
  }
};

module.exports = {
  mangaSort,
  mangaAppendService,
};
