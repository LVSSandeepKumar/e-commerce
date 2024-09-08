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
      //Find hashtag or else create one with the name
      let hashtag = await Hashtag.findOne({ name: tag });
      if (!hashtag) {
        hashtag = new Hashtag({ name: tag });
      }
      //Update the post and hashtag details and save them
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
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
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

export const downVotePost = async (req, res) => {
  try {
    //Fetch the postId and userId from req
    const userId = req.user._id;
    const { id: postId } = req.params;
    //Find the post with the given ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    //Check if the user has already down voted the post
    const hasUserDownVotedPost = post.downVotes.includes(userId);
    if (hasUserDownVotedPost) {
      //Undo Down Vote
      await post.updateOne({ $pull: { downVotes: userId } });
    } else {
      //Down Vote
      await post.updateOne({ $push: { downVotes: userId } });
    }
    //Save the changes in post and send to client
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    //Error Handling
    console.log("Error in downVotePost controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const savePost = async (req, res) => {
  try {
    //Fetch userId and postId from req
    const userId = req.user._id;
    const { id: postId } = req.params;
    //Find the post with the given ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    //Find the user and check user's saved posts
    const user = await User.findById(userId).select("-password");
    const isPostSaved = user.savedPosts.includes(postId);
    if(isPostSaved) {
      //Unsave Post
      await user.updateOne({$pull: {savedPosts : postId}});
    } else {
      //Save Post
      await user.updateOne({$push: {savedPosts: postId}});
    }
    //Save the user and return to client
    await user.save();
    return res.status(200).json(user);
  } catch (error) {
    //Error Handling
    console.log("Error in savePost controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSavedPosts = async (req, res) => {
  try {
    //Get userId from req
    const userId = req.user._id;
    //Fetch the saved posts of that user from db and return back to client
    const savedPosts = await User.findById(userId).populate("savedPosts").select("-password");
    return res.status(200).json(savedPosts);
  } catch (error) {
    //Error Handling
    console.log("Error in getSavedPosts controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
