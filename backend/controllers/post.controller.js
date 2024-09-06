import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import extractHashtags from "../utils/extractHashtags.js";
import Hashtag from "../models/hashtag.model.js";

export const createPost = async (req, res) => {
  try {
    //Check if there are text and image & Fetch them from req body
    const { text } = req.body;
    const hashtags = extractHashtags(req.body);
    let { image } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Post should have text" });
    }
    //Get userId from req and check for the user
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //Upload the image to cloudinary and get image URL
    if (image) {
      const response = await cloudinary.uploader.upload(image);
      img = response.secure_url;
    }
    //Create new post
    const post = new Post({
      text,
      images: image,
      author: userId,
    });
    //Implement Hashtags
    for (let tag of hashtags) {
      let hashtag = await Hashtag.findOne({ name: tag });
      if (!hashtag) {
        hashtag = new Hashtag({ name: tag });
      }
      hashtag.posts.push(post._id);
      post.hashtags.push(hashtag._id);
      await hashtag.save();
    }
    //Save the post and return it to client
    await post.save();
    return res.status(201).json({ post, message: "Post created successfully" });
  } catch (error) {
    //Error Handling
    console.log(`Error in createPost controller`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    //Fetch all posts from DB and send them to client
    const posts = await Post.find().sort({ createdAt: -1 });
    if (!posts) {
      return res.status(200).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    //Error Handling
    console.log(`Error in getAllPosts controller`, error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostsByHashtag = async (req, res) => {
  try {
    //Fetch the hashtag name from req params
    const { hashtagName } = req.params;
    //Check if the hashtag exists
    const hashtag = await Hashtag.findOne({ name: hashtagName });
    if (!hashtag) {
      //Send an empty array instead of error message for better handling in client
      return res.status(404).json([]);
    }
    //Fetch all posts with that hashtag and return to client
    const posts = await Post.find({ hashtags: hashtag._id })
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("hashtags", "name");
    return res.status(200).json(posts);
  } catch (error) {
    //Error Handling
    console.log("Error in getPostsByHashtag controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const upVotePost = async (req, res) => {
  try {
    //Fetch postId and userId from request
    const userId = req.user._id;
    const { id: postId } = req.params;
    //Find the post with that Id
    const post = await Post.findById(postId);
    //Check if the user has already upVoted the post
    const hasUserUpVotedPost = post.upVotes.includes(userId);
    if (hasUserUpVotedPost) {
      //Undo the upVote
      await post.updateOne({ $pull: { upVotes: userId } });
    } else {
      //upVote
      await post.updateOne({ $push: { upVotes: userId } });
    }
    //Save the post and return the client to user
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    //Error Handling
    console.log("Error in upVotePost controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
