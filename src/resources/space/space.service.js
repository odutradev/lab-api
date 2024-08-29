import replaceMarkdown from "../../util/replaceMarkdown.js";
import spaceModel from "../../models/space.js";
import userModel from "../../models/user.js";
import email from "../../util/email.js";

export default class Service {

    async createSpace({ name, payload }, { userID }){
        try {
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const hasUserSpace = user.spaces.find(space => space.name === name);
            if (hasUserSpace)  return { error: "space_already_exists" };
            const space = new spaceModel({
                createAt: Date.now(),
                creator: userID,
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
            console.log(err)
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
            const hasSpace = user.spaces.find(x => x.id == spaceID);
            if (hasSpace) return { error: "user_already_in_space" }; 
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
            email(markdown, guest.email, 'Você recebeu um convite!');
            return { space, user: guest };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async acceptInvitation({ spaceID, userID }, { }){
        try {
			const space = await spaceModel.findById(spaceID);
			if (!space) return { error: "space_not_found" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const spaceIndex = user.spaces.findIndex(x => x.id == spaceID);
            const findSpace = user.spaces.find(x => x.id == spaceID);
            if (spaceIndex == -1) return { error: "invitation_not_found"};
            const inviteBy = await userModel.findById(user.spaces[spaceIndex].invitedBy.id);
            findSpace.invite = false;
            user.spaces[spaceIndex] = findSpace;
            await user.save();
            const markdownGuest = replaceMarkdown('acceptInvite', [
                ['name', user.name],
                ['name', user.name],
                ['invitedBy', inviteBy.name],
                ['space', space.name],
            ]);
            email(markdownGuest, user.email, 'Você está participando de um novo espaço!');   
            const markdown = replaceMarkdown('invitationAccepted', [
                ['name', user.name],
                ['name', user.name],
                ['invitedBy', inviteBy.name],
                ['space', space.name],
            ]);
            email(markdown, inviteBy.email, 'O convite foi aceito!');  
            return { space, user };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async denyInvitation({ spaceID, userID }) {
        try {
            const space = await spaceModel.findById(spaceID);
            if (!space) return { error: "space_not_found" };
            const user = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found" };
            const spaceIndex = user.spaces.findIndex(x => x.id == spaceID);
            if (spaceIndex === -1) return { error: "invitation_not_found" };
            user.spaces.splice(spaceIndex, 1);
            await user.save();
            return { space, user };
        } catch (err) {
            return { error: "internal_error" };
        }
    }

    async leaveSpace({ spaceID, userID }) {
        try {
            const space = await spaceModel.findById(spaceID);
            if (!space) return { error: "space_not_found" };
            const user = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found" };
            const spaceIndex = user.spaces.findIndex(x => x.id == spaceID);
            if (spaceIndex === -1) return { error: "invitation_not_found" };
            user.spaces.splice(spaceIndex, 1);
            await user.save();
            return { space, user };
        } catch (err) {
            return { error: "internal_error" };
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