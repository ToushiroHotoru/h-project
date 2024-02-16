const errorDTO = require("../../dto/Error.dto");

const allMangasSchema = {
  schema: {
    query: {
      type: "object",
      properties: {
        page: { type: "number" },
        sort: { type: "string" },
        tags: { type: "string" },
      },
      required: ["page", "sort"],
    },
    response: {
      "2xx": {
        type: "object",
        required: ["status", "data"],
        properties: {
          status: { type: "string" },
          data: {
            type: "object",
            properties: {
              total: { type: "number" },
              offset: { type: "number" },
              step: { type: "number" },
              mangas: { type: "array", items: { $refs: "#/$defs/manga" } },
            },
          },
        },
        $defs: {
          manga: {
            type: "object",
            properties: {
              _id: { type: "string" },
              title: { type: "string" },
              cover: { type: "string" },
              artist: { type: "string" },
              series: { type: "string" },
              likes: { type: "number" },
              views: { type: "number" },
              cycle: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  part: { type: "number" },
                },
              },
              pages: { type: "array", items: { type: "string" } },
              createdAt: { type: "string" },
              tags: { type: "array", items: { $ref: "#/$defs/tag" } },
            },
          },
          tag: {
            type: "object",
            properties: {
              _id: { type: "string" },
              miniImage: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
      ...errorDTO,
    },
  },
};

const homePageMangasSchema = {
  schema: {
    response: {
      "2xx": {
        type: "object",
        required: ["status", "data"],
        properties: {
          status: { type: "string" },
          data: {
            type: "object",
            properties: {
              mangas: { type: "array", items: { $refs: "#/$defs/manga" } },
            },
          },
        },
        $defs: {
          manga: {
            type: "object",
            properties: {
              _id: { type: "string" },
              title: { type: "string" },
              cover: { type: "string" },
            },
          },
        },
      },
      ...errorDTO,
    },
  },
};

const readerMangaPagesSchema = {
  schema: {
    query: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string" },
      },
    },
    response: {
      "2xx": {
        type: "object",
        required: ["status", "data"],
        properties: {
          status: { type: "string" },
          data: {
            type: "object",
            properties: {
              manga: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  title: { type: "string" },
                  pages: { type: "array", items: { $ref: "#/$defs/page" } },
                },
              },
            },
          },
        },
        $defs: {
          page: {
            type: "object",
            properties: {
              size: {
                type: "object",
                properties: {
                  height: { type: "number" },
                  width: { type: "number" },
                  type: { type: "number" },
                },
              },
              image: { type: "string" },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  allMangasSchema,
  homePageMangasSchema,
  readerMangaPagesSchema,
};
