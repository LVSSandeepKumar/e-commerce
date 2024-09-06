import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  images: [
    {
        type: String
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  hashtags: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hashtag"
    }
  ],
  upVotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  downVotes:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
}, {timestamps: true})

const Post = mongoose.model("Post", postSchema);

export default Post;