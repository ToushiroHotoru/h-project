const fs = require("fs");
const path = require("path");

const welcomePage = (request, reply) => {
  const stream = fs.createReadStream(path.join("views", "index.html"), "utf8");
  reply.header("Content-Type", "text/html");
  reply.send(stream);
};

module.exports = {
  welcomePage,
};
