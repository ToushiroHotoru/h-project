const Manga = require("../schemas/Manga.schema");

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const mangaSort = async (sort, offset, step) => {
  let mangas = null;
  switch (sort) {
    case "latest":
      mangas = await Manga.sortByTime(offset, step);
      break;
    case "alphabet":
      mangas = await Manga.sortByAlphabet(offset, step);
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
      tags: ["pagination", "lero"],
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
