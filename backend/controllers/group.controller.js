import Group from "../models/group.model.js";
import Hashtag from "../models/hashtag.model.js";

export const createGroup = async (req, res) => {
  try {
    //Fetch userId from req
    const userId = req.user._id;
    //Fetch name and hashtags from req body
    const { name, hashtags } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    //Create a group
    const group = new Group({
      name,
      owner: userId,
      admins: [userId],
      participants: [userId],
    });
    //Implement Hashtags
    if (hashtags && Array.isArray(hashtags)) {
      for (let tag of hashtags) {
        tag = tag.toLowerCase();
        //Find the hashtag or create one with the given name
        let hashtag = await Hashtag.findOne({ name: tag });
        if (!hashtag) {
          hashtag = new Hashtag({ name: tag });
        }
        //Update hashtags and groups and save the hashtag
        hashtag.groups.push(group._id);
        group.hashtags.push(hashtag._id);
        await hashtag.save();
      }
    }
    //Save the group and return back to client
    await group.save();
    return res.status(201).json(group);
  } catch (error) {
    //Error Handling
    console.log("Error in createGroup controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    //Get All Groups and return them to client
    const groups = await Group.find();
    return res.status(200).json(groups);
  } catch (error) {
    //Error Handling
    console.log("Error in getAllGroups controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupsByPopularity = async (req, res) => {
  try {
    //Fetch groups based on the number of participants
    const groups = await Group.aggregate([
      {
        $project: {
          name: 1,
          hashtags: 1,
          owner: 1,
          admins: 1,
          participants: 1,
          participantsCount: { $size: "$participants" },
        },
      },
      {
        $sort: {
          participantsCount: -1,
        },
      },
    ]);
    //Return the groups to client
    return res.status(200).json(groups);
  } catch (error) {
    //Error Handling
    console.log("Error in getGroupsByPopularity controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
