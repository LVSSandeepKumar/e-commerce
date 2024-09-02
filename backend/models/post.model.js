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
        type:String
    }
  ],
})

const Post = mongoose.model("Post", postSchema);

export default Post;