const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");  // npm i bcryptjs
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const validator = require('validator'); // npm i validator

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true,"Please enter your email."],
        unique:true,
        validate: [validator.isEmail,"Please enter a valid email."]
    },
    password : {
        type: String,
        required: true,
        minlength:[7,"Password should be more than 8 characters"],
        select: false  // when we query.find() -> password will not be selected
    },
    tokens : [
        {
        token: {
            type: String,
            required: true
            }
        }
             ]
    ,
    created_at : {
        type: Date,
        default: Date.now
    }
    ,
    updated_at : {
        type: Date,
        default: Date.now
    }
});

// These function run before save
userSchema.pre( 'save', async function ( next ){
    if( this.isModified('password') )
    {   
        this.password = await bycrypt.hash( this.password, 12 );
    
    }
    next();
} );

userSchema.methods.generateAuthToken = async function() {
    try
    {
        let token =  jwt.sign({ _id:this._id }, process.env.SECRET_KEY) 
        // 2 param - payload (shoud be unique)   and secret key 
        this.tokens = this.tokens.concat({ token:token });
        await this.save();
        return token;
    } 
    catch(err)
    {
        console.log(err);
    }
}

const User = new mongoose.model("User",userSchema);

module.exports = User;