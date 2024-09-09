import Group from "../models/group.model.js";

export const adminRoute = async(req,res,next) => {
    try {
        //Fetch the userId and groupId from req
        const userId = req.user._id;
        const {groupId} = req.params;
        //Check for the group with the given Id
        const group = await Group.findById(groupId);
        if(!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        //Check if the user is admin of that group
        const isAdmin = group.admins.includes(userId);
        //If the user is not admin, respond with error message
        if(!isAdmin) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        //If the user is admin, proceed to next middleware or controller
        next();
    } catch (error) {
        //Error Handling
        console.log("Error in adminRoute middleware", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}