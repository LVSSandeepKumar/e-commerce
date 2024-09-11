import Group from "../models/group.model.js";
import Hashtag from "../models/hashtag.model.js";

export const createGroup = async (req, res) => {
  try {
    //Fetch userId from req
    const userId = req.user._id;
    //Fetch name and hashtags from req body
    const { name, hashtags, isPublic } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    //Create a group
    const group = new Group({
      name,
      owner: userId,
      isPublic,
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

export const getGroupsByHashtag = async (req, res) => {
  try {
    const { hashtag } = req.params;
    const foundHashtag = await Hashtag.findOne({ name: hashtag.toLowerCase() });
    if (!foundHashtag) {
      return res.status(404).json({ message: "No hashtag found" });
    }
    const groups = await Group.find({ hashtags: foundHashtag._id })
      .populate("owner", "username")
      .populate("admins", "username")
      .populate("participants", "username")
      .populate("hashtags", "name");

    return res.status(200).json(groups);
  } catch (error) {
    //Error Handling
    console.log("Error in getGroupsByHashtags", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    //Get groupId from req
    const { groupId } = req.params;
    //Find for group with the id
    const group = await Group.findById(groupId)
      .populate("participants", "username")
      .populate("requests", "username")
      .populate("admins", "username");
    //Send the group in response to client
    return res.status(200).json(group);
  } catch (error) {
    //Error Handling
    console.log("Error in getGroupDetails controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinGroup = async (req, res) => {
  try {
    //Fetch userId and groupId from request
    const userId = req.user._id;
    const { groupId } = req.params;
    //Check if there is a group with the given Id
    const group = await Group.findById(groupId)
      .populate("participants", "username")
      .populate("requests", "username")
      .populate("admins", "username");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    //Check if the user is already a part of group or not
    const isAlreadyJoined =
      group.participants.includes(userId) || group.requests.includes(userId);
    //Check if the group is public or not
    const isPublicGroup = group.isPublic;
    //If the user has not joined
    if (!isAlreadyJoined) {
      if (isPublicGroup) {
        //Add userId to participants
        group.participants.push(userId);
      } else {
        //Add userId to requests
        group.requests.push(userId);
      }
    } else {
      return res
        .status(400)
        .json({ message: "You are already a part of group" });
    }
    //Save the group changes and send the response to client
    await group.save();
    return res.status(200).json({
      message: `${
        isPublicGroup ? "Group joined successfully" : "Group join request sent"
      }`,
      group,
    });
  } catch (error) {
    //Error Handling
    console.log("Error in joinGroup controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptRequest = async (req, res) => {
  try {
    //Fetch the userId to be accepted and groupId from req params
    const { id: userId, groupId } = req.params;
    //Find the group with the id
    const group = await Group.findById(groupId)
      .populate("participants", "username")
      .populate("requests", "username")
      .populate("admins", "username");
    //Pop the userId from requests and push to participants
    group.requests.pop(userId);
    group.participants.push(userId);
    //Save the group and respond to client
    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    //Error handling
    console.log("Error in acceptRequest controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRequest = async(req,res) => {
  try {
    const {groupId, id:userId} = req.params;

    const group = await Group.findByIdAndUpdate(groupId, {$pull: {requests: userId}})
    .populate("requests", "username")
    .populate("participants", "username")

    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    //Error Handling
    console.log("Error in deleteRequest controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const removePerson = async (req, res) => {
  try {
    //Fetch userId and groupId from req params
    const { groupId, id: userId } = req.params;
    //Find the group with the ID
    const group = await Group.findByIdAndUpdate(groupId, {$pull : {participants : userId}})
      .populate("admins", "username")
      .populate("participants", "username");
    //Save the changes and return the group in response to client
    await group.save();
    return res.status(200).json(group);
  } catch (error) {
    //Error Handling
    console.log("Error in removePerson controller", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
