const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const encrypt = require('mongoose-encryption');
const secret = process.env.DB_ENCRYPT_SECRET;

/** User schema */
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });



/** User model */
const userModel = mongoose.model('User', userSchema);


// Exports ---------------------
module.exports = userModel;
// export { userSchema };