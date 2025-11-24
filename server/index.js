// Starting our server we need ----
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRouter from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"


// congig the env (Load Environment Variables)
dotenv.config(); // With this cmd Reads your .env file and makes all variables available in process.env

const app = express(); // Creating the web server
const port = process.env.PORT || 3001; // incase of not port start server on 3001 port 
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: [process.env.ORIGIN], // from where your request is going to be made can have multiple origins
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // methods that are available with this origin these are all the restAPIs method 
    credentials:true // allows cookies/JWT tokens to be sent with requests. Without this, your React app wouldn’t be able to include cookies/JWT tokens.

}));

app.use("/uploads/profiles", express.static("/uploads/profiles"));
 
// Setup Middleware---------

app.use(cookieParser());

app.use(express.json()); // to have our body in json format

app.use("/api/auth", authRoutes); // whenever we have a request to /api/auth it will be handled by authRoutes

app.use("/api/contacts", contactRouter);

// Setting up our server
const server = app.listen(port, ()=>{
    console.log(`Server is running at: http:..localhost:${port}`);
})

setupSocket(server);

// Connecting our database

mongoose.connect(databaseURL)
.then(()=> console.log("DB connection sucessful"))
.catch((err) => console.log(err.message)); // running the callback function .then .catch is for debugging purposes