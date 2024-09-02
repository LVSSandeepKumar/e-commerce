import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req,res) => {
    try {
        //Check if user has entered all valid credentials and fetch them from req body
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all valid fields" });
        }
        //Check if there is any user with the given email and username
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail) {
            return res.status(400).json({ message: "Email already taken" });
        }
        //Incase of a new user, hash the user password before saving to db
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        //Generate Token and set cookie
        generateTokenAndSetCookie(user._id, res);
        await user.save();
        //Return the user back to client without password
        return res.status(201).json({
            user: {
                ...user._doc,
                password: null
            },
            message: "User created successfully"
        })
    } catch (error) {
        //Error Handling
        console.log("Error in signup controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const login = async (req,res) => {
    try {
        //Check if user entered both email and password
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please enter both email & password" });
        }
        //Check if user exist in our db
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({ message: "No user found with this email" });
        }
        //Compare the user password with password entered
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(401).json({ message: "Incorrect Password" });
        }
        //Generate Token and Set Cookie
        generateTokenAndSetCookie(user._id, res);
        return res.status(201).json({ user: {
            ...user._doc,
            password: null
        }})
    } catch (error) {
        //Error Handling
        console.log("Error in login controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const logout = async (req,res) => {
    try {
        //Clear the cookies
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logout Successful" });
    } catch (error) {
        //Error Handling
        console.log("Error in logout controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}

export const getMe = async(req,res) => {
    try {
        const user = req.user;
        return res.status(200).json({user});
    } catch (error) {
        //Error Handling
        console.log("Error in getMe controller", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}