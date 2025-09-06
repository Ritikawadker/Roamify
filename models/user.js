const express = require("express");
const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    }
})

userSchema.plugin(passportLocalMongoose);   
//automatically implement username and password keys with hashing and salting
 module.exports = mongoose.model("User", userSchema);