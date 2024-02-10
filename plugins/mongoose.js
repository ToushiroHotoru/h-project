const mongoose = require("mongoose");

async function mongooseInit(fastify, opts, done) {
  try {
    await mongoose.connect(
      "mongodb+srv://h-project:NaDSwTgyCZxOFa2F@h-project-manga.okzes.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.log(`db connection error - ${err}`);
  }
  done();
}

module.exports = mongooseInit;
