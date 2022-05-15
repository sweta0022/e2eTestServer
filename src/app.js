require("dotenv").config();
const express = require("express"); // 
const app = express();
app.use(express.json()); // whenever data will come in format of json it will convert it into object

var cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors')
app.use(cors());

require('./database/connection'); // Database connection
 
 app.use( require('./routes/auth.js') );    

app.listen( process.env.PORT , () => {
    console.log("Listening port on "+process.env.PORT);
} );