const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


/** User schema */
const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String }
});

userSchema.plugin(passportLocalMongoose);

/** User model */
const userModel = mongoose.model('User', userSchema);


// Exports ---------------------
module.exports = userModel;
// export { userSchema };