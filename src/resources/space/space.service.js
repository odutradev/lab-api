import spaceModel from "../../models/space.js";
import userModel from "../../models/user.js";

export default class Service {

    async createSpace({ name, payload }, { userID }){
        try {
            const hasSpace = await spaceModel.findOne({ name });
            if (hasSpace)  return { error: "space_already_exists" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const space = new spaceModel({
                createAt: Date.now(),
                admin: userID,
                payload,
                name,
            });
            await space.save();
            user.spaces = [
                ...user.spaces,
                 {
                    entryDate: Date.now(),
                    id: space._id,
                    permissions: [
                        'MANAGE_COMPANY'
                    ],
                    name,
                }
            ];
            await user.save();
            return { space, user };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getSpaceUsers({}, { spaceID }){
        try {
            return await userModel.find({ "spaces.id": spaceID }).select('-password');
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getSpace({}, { spaceID }){
        try {
            const space = await spaceModel.findById(spaceID);
            if (!space) return { error: "space_not_found" };
            return space;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
    async updateSpace({ data }, { spaceID, userID }){
        try {
			const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const userSpaceData = user.spaces.find(x => x.id == spaceID);
            const hasManagePermission = userSpaceData.permissions.find(x => x == "MANAGE_COMPANY");
            if (!hasManagePermission) return { error: "no_permission_to_execute"};
            const newSpace = await spaceModel.findByIdAndUpdate(spaceID, { $set:{ ...data } }, { new: true });
			return newSpace;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}