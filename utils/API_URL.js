const LINK =
  process.env.NODE_ENV !== "development"
    ? "https://api.h-project.fun"
    : "http://localhost:8080";

module.exports = LINK;
