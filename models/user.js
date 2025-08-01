const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    }
})

userSchema.plugin(passportLocalMongoose); //automatically adds username and password fields, and handles hashing and salting of passwords.

module.exports = mongoose.model("User", userSchema);