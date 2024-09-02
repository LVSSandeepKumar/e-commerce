import {v2 as cloudinary} from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";

export const createPost = async (req,res) => {
    try {
        //Check if there are text and image & Fetch them from req body
        const {text, hashtags} = req.body;
        let {image} = req.body;
        if(!text) {
            return res.status(400).json({ message: "Post should have text" });
        }
        //Get userId from req and check for the user
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }
        //Upload the image to cloudinary and get image URL
        if(image) {
            const response = await cloudinary.uploader.upload(image);
            img = response.secure_url;
        }
        //Create new post
        const post = new Post({
            text,
            images: image,
            hashtags
        })
        await post.save();
        //Return the post to client
        return res.status(201).json({post, message: "Post created successfully"});
    } catch (error) {
        //Error Handling
        console.log(`Error in createPost controller`, error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}