const { types, required } = require('joi');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');
// const LocalStrategy = require('passport-local');

const userSchema = new Schema({
    role:{
        type:String,
        required:true
    },
    email : {
        type : String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema)