const fastify = require('fastify')()

async function jwtInit(fastify, opts, done) {
  fastify.register(require('@fastify/jwt'), {
    secret: 'supersecret'
  })

  fastify.decorate("authenticate", async function(request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })


  // fastify.get(
  //   "/",
  //   {
  //     onRequest: [fastify.authenticate]
  //   },
  //   async function(request, reply) {
  //     return request.user
  //   }
  // )
}

module.exports = jwtInit;