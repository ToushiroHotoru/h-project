async function bcryptHash(fastify, opts, done) {
  fastify.register(require('fastify-bcrypt'), {
    saltWorkFactor: 12
  })
}

module.exports = bcryptHash;
