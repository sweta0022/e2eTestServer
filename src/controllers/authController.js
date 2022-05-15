const bcrypt = require('bcryptjs');
require('../database/connection');
const User = require('../models/userSchema.js');
const formdataSchema = require('../models/formdataSchema.js');

const signin = async( req,res ) => {
   
    const { email, password } = req.body;
   
    try
    {
        if( !email || !password )
        {
            res.status(200).json({ status:422,message:"Please provide email and password."});
        }
        else
        {
            // end insert data code as register was not mention
                // const userIn = new User({ email:email, password:password });
                // const userSave = await userIn.save();
                // res.status(200).json({status:200, message:"Inserted"});
            // end insert data code as register was not mention

            const emailExist = await User.findOne({ email: email });
            if( !emailExist )
            {
               res.status(200).json({status:422, message:"Invalid User"});
            }
            else
            {
                // const isUserExists = await User.find({ $and: [ {email:email} , {password:password} ] });
                const isUserExists = await User.findOne({  email:email }).select("+password");
               
                if( isUserExists.length !== 0 )
                {
                   
                    const isMatch = await bcrypt.compare( password , isUserExists.password );
                    if( !isMatch )
                    {                        
                        res.status(200).json({status:422,message:"Invalid Credentials."});
                        // res.status(200).json({status:200,message:"Invalid Credentials."});
                    }
                    else    
                    {
                        const token = await isUserExists.generateAuthToken(); // calling function from model
                        
                        var formDataExists = 0
                            // formDataExists = await formdataSchema.find({user:'isUserExists._id'});
                            formDataExists = await formdataSchema.find({user:isUserExists._id}).countDocuments();
                           
                        res.status(200).json({status:200,message:"Successfully logged In.",result:isUserExists,token:token,formDataExists:formDataExists});
                    }
                }
                else
                {
                    res.status(200).json({status:422,error:"Invalid User"});
                }
            }
        }
        
    }
    catch(err)
    {
       
        res.status(500).json({ error: err.message });
    }
}

const formdata = async( req, res ) => {
   
    try
    { 
        // Destructuring
        const { full_name, email, password, mobile, gender, country, state, city } = req.body.userDetail;     
        const language = req.body.language;     
        if( full_name !== "" && mobile !== "" && gender !== "" )
        {
            
            // const isUserDetailExists = await formdataSchema.find({user:req.userId});
           
            const creatQry = await formdataSchema.update(
                {user:req.userId},
                {
                "full_name":full_name, 
                "gender":gender, 
                "mobile":mobile, 
                "language":language, 
                "city":city, 
                "state":state, 
                "country":country, 
                "user": req.userId
                }, { upsert: true });
    
            if( !creatQry )
            {
                res.status(200).json({"status":406 ,message:"Something went wrong",error:creatQry});
            }
            res.status(200).json({"status":201,message:"Details have been submitted successfully."});
        }
        else
        {
            res.status(200).json({status: 401,message:"All fields are required"});
        }
       
    }
    catch(err)
    {
        res.status(401).json({status: 401,message:"Something went wrong",error:err.message});

    }
}

const userFormData = ( req, res ) => {
   
    try
    { 
        User.aggregate([
           {
                $lookup: {
                        from: "formdatas",
                        localField: "_id",
                        foreignField: "user",
                        as: "user_data"
                    }
            },
            {
                $unwind: "$user_data",
            },
            { $project: { "tokens": 0} },
        ]).then((result) => {
            res.status(200).json({status: 200,message:"Data Retrieve Successfully",employees:result});
          })
          .catch((error) => {
            res.status(500).json({status: 500,message:"Something went wrong",error:error.message});
          });

       
       
    }
    catch(err)
    {
        res.status(500).json({status: 500,message:"Something went wrong",error:err.message});

    }
}


const userDetail = ( req, res ) => {
   
    try
    { 
          User.aggregate([
           {
                $lookup: {
                        from: "formdatas",
                        localField: "_id",
                        foreignField: "user",
                        as: "user_data"
                    }
            },
            {
                $unwind: "$user_data", 
            },
            {
                $match: {
                  _id: req.userId
                }
            }
          ]).then((result) => {
            res.status(200).json({status: 200,message:"Data Retrieve Successfully",employee:result});
          })
          .catch((error) => {
            res.status(500).json({status: 500,message:"Something went wrong",error:error.message});
          });

       
       
    }
    catch(err)
    {
        res.status(500).json({status: 500,message:"Something went wrong",error:err.message});
    }
}



module.exports = {
    signin,formdata,userFormData,userDetail
}