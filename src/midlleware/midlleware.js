const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const authenticate = async ( req, res, next ) => {
   
    try
    { 
        if( req.headers["x-access-token"])
        {
            const token = req.headers["x-access-token"]; 
            const verifyToken = jwt.verify( token, process.env.SECRET_KEY);
             
            const authenticateUser = await User.findOne({ _id: verifyToken._id, "tokens.token":token }).select({password:0, tokens:0,  updated_at:0});
    
            if(!authenticateUser)
            {
                res.status(401).json({ status: 401, message: "User not found" });
            }
            else
            {
                req.authenticateUser = authenticateUser;
                req.userId = authenticateUser._id;
                next();
            }
        }
        else
        { 
            res.status(200).json({ status: 401, message: "Please send token" });
            return; // console.log("Please send token");
        }
       
      
    }
    catch(err)
    {
        res.status(200).json({'status':401,'message':'Unauthorized User',error:err});
        console.log(err);
    }
    
} 

module.exports = authenticate;