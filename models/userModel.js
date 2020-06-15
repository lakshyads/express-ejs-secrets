const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/** User schema */
const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});


/** User model */
const userModel = mongoose.model('User', userSchema);


// Exports ---------------------
module.exports = userModel;
// export { userSchema };