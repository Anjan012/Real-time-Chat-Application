// Starting our server we need ----
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"


// congig the env
dotenv.config(); // With this cmd all the env will be in process.env

const app = express();
const port = process.env.PORT || 3001; // incase of not port start server on 3001 port 
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN], // from where your request is going to be made can have multiple origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // methods that are available with this origin these are all the restAPIs method 
    credentials:true // for enabling cookies

}));

app.use(cookieParser());

app.use(express.json()); // to have our body in json format

// Setting up our server
const server = app.listen(port, ()=>{
    console.log(`Server is running at: http:..localhost:${port}`);
})

// Connecting our database

mongoose.connect(databaseURL)
.then(()=> console.log("DB connection sucessful"))
.catch((err) => console.log(err.message)); // running the callback function .then .catch is for debugging purposes