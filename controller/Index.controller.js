const fs = require('fs');
const welcomePage = (request, reply) => {
	const stream = fs.createReadStream('views/index.html', 'utf8');
	reply.header('Content-Type', 'text/html');
	reply.send(stream);
};

module.exports = {
	welcomePage,
};
