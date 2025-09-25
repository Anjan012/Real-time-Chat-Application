import mongoose from "mongoose";
import bcrypt, { genSalt } from "bcrypt";

const userSchema = new mongoose.Schema({

    email:{
        type: String,
        required: [true, "Email is required"], // required whenever we create a new user
        unique: true // no two users can have the same email
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    firstName:{
        type: String,
        required: false
    },
    lastName:{
        type: String,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    color:{
        type: Number, // just to match the index with frontend
        required: false
    },
    profileSetup:{ // Tracks if user completed their profile setup, Two-step registration process
        type: Boolean,
        default: false 
    }
});


// Before a User document is saved in the database, this function runs. It hashes the user’s password so that plain text is never stored.
userSchema.pre("save", async function(next){ // don't use arrow function here because we need the 'this' keyword and this keyword doesn't work with arrow functions

    // encrypt the password using bcrypt package
    const salt = await genSalt(); 
    this.password = await bcrypt.hash(this.password, salt); 
    next(); // tells server to move to the next step
});

// creating the model and storing it inside the user variable
const user = mongoose.model("Users", userSchema);

export default user; // exporting the model so that we can use it in other files