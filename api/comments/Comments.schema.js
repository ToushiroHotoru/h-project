const errorDTO = require("../../dto/Error.dto");

const addCommentValidation = {
  shema: {
    body: {
      type: "object",
      properties: {
        mangaId: { type: "string" },
        text: { type: "string" },
        answersFor: { type: "string" },
      },
      required: ["mangaId", "text"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          data: {
            type: "object",
            properties: {
              id: {
                type: "string",
              },
              comment: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  answersFor: { type: "string" },
                },
              },
              user: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  username: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
        required: ["status", "data"],
      },
      ...errorDTO,
    },
  },
};

const getCommentValidation = {
  schema: {
    query: {
      type: "object",
      minProperties: 1,
      properties: {
        route: { type: "string" },
      },
      required: ["route"],
    },
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "string" },
          data: {
            type: "object",
            properties: {
              comments: {
                type: "array",
                items: { $ref: "#/$defs/comment" },
              },
            },
          },
        },
        $defs: {
          comment: {
            type: "object",
            properties: {
              _id: { type: "string" },
              text: { type: "string" },
              answersFor: { type: ["null", "string"] },
              createdAt: { type: "string" },
              user: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  username: { type: "string" },
                  avatar: { type: "string" },
                },
              },
            },
          },
        },
        required: ["status", "data"],
      },
      ...errorDTO,
    },
  },
};

module.exports = { addCommentValidation, getCommentValidation };
