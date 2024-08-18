import replaceMarkdown from "../../util/replaceMarkdown.js";
import spaceModel from "../../models/space.js";
import userModel from "../../models/user.js";
import email from "../../util/email.js";

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
                        'MANAGE_SPACE'
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
    
    async inviteToSpace({ spaceID, guestID }, { userID }){
        try {
			const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };
            const guest  = await userModel.findById(guestID).select('-password');
            if (!guest) return { error: "user_not_found"};
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            guest.spaces = [
                ...guest.spaces,
                 {
                    entryDate: Date.now(),
                    name: space.name,
                    invite: true,
                    invitedBy: {
                        id: userID,
                        name: user.name
                    },
                    id: space._id,
                }
            ];
            await guest.save();
            const markdown = replaceMarkdown('invite', [
                ['name', guest.name],
                ['invitedBy', user.name],
                ['space', space.name],
                ['spaceID', spaceID]
            ]);
            await email(markdown, guest.email, 'Você recebeu um convite!');
            return { space, user: guest };
        } catch (err) {
            console.log(err)
            return { error: "internal_error" } ;
        }
    }
    async updateSpace({ data, spaceID }, { userID }){
        try {
			const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const userSpaceData = user.spaces.find(x => x.id == spaceID);
            const hasManagePermission = userSpaceData.permissions.find(x => x == "MANAGE_SPACE");
            if (!hasManagePermission) return { error: "no_permission_to_execute"};
            const newSpace = await spaceModel.findByIdAndUpdate(spaceID, { $set:{ ...data } }, { new: true });
			return newSpace;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async deleteSpace({}, { userID }, { spaceID }){
        try {
            const space = await spaceModel.findById(spaceID);
            if (!space) return { error: "space_not_found" };
            const user = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found" };
            const userSpaceData = user.spaces.find(x => x.id == spaceID);
            const hasManagePermission = userSpaceData?.permissions.find(x => x == "MANAGE_SPACE ");
            if (!hasManagePermission) return { error: "no_permission_to_execute" };
            await spaceModel.findByIdAndDelete(spaceID);
            user.spaces = user.spaces.filter(x => x.id !== spaceID);
            await user.save();
            return user;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}