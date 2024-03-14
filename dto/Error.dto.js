const errorDTO = {
  401: {
    type: "object",
    properties: {
      status: { type: "string" },
      message: { type: "string" },
    },
    required: ["status", "message"],
  },
  404: {
    type: "object",
    properties: {
      status: { type: "string" },
      message: { type: "string" },
    },
    required: ["status", "message"],
  },
  500: {
    type: "object",
    properties: {
      status: { type: "string" },
      message: { type: "string" },
    },
    required: ["status", "message"],
  },
};

module.exports = errorDTO;
