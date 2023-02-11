const fastify = require('fastify')()

async function bcryptInit(fastify, opts, done) {
  fastify.register(require('fastify-bcrypt'), {
    saltWorkFactor: 12
  })
}

module.exports = bcryptInit;