const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	preferences: { type: Array },
});

module.exports = model('User', userSchema);
