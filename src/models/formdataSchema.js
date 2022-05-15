const mongoose = require("mongoose");

const formdataSchema = new mongoose.Schema({
    full_name:{
        type: String,
        required:[true,"Please enter name."],
        trim: true
    },
    gender:{
        type: String,
        required:[true,"Please select gender."],
        trim: true
    },
    language:{       
            hindi: {
              type: Boolean,
              ref: "User",
              required: true,
              default: false,
            },
            english: {
              type: Boolean,
              required: true,
              default: false,
            },      
    },
    mobile:{
        type: String,
        required:[true,"Please enter mobile."],
        trim: true
    },
    city: {
        type: String,
        required: true,
      },
  
      state: {
        type: String,
        required: true,
      },
  
      country: {
        type: String,
        required: true,
      },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    // language:
    //     {
    //         public_id: {
    //           type: String,
    //           required: true,
    //         },
    //         url: {
    //           type: String,
    //           required: true,
    //         },
    //       },    
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

const formdata = new mongoose.model("formdata",formdataSchema);

module.exports = formdata; 