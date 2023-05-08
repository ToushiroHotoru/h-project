const mongoose = require("mongoose");
// const chalk = require("chalk");

async function mongooseInit(fastify, opts, done) {
  try {
    await mongoose.connect(
      "mongodb+srv://h-project:NaDSwTgyCZxOFa2F@h-project-manga.okzes.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (err) {
    // console.log(`db connection error - ${chalk.red(err)}`);
  }
  done();
}

module.exports = mongooseInit;
