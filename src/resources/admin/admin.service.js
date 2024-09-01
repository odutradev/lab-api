import userModel from "../../models/user.js";
import email from "../../util/email.js";
import replaceMarkdown from "../../util/replaceMarkdown.js";

export default class Service {

    async getUser({}, {}, { userID }){
        try {
			const user = await userModel.findById(userID).select('-password');
			if (!user) return { error: "user_not_found" };
            return user;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getAllUsers(){
        try {
			return await userModel.find().sort({ date: -1 }).select('-password');
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getPendingUsers(){
        try {
			return await userModel.find({ status: "pending" }).sort({ date: -1 }).select('-password');
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async approveUser({}, {}, { userID }){
        try {
            const user = await userModel.findById(userID);
			if (!user) return { error: "user_not_found" };
            const newUser = await userModel.findByIdAndUpdate(userID, { $set:{ status: 'logged', approvedAt: Date.now() } }, { new: true }).select('-password');
            const markdown = replaceMarkdown('approve', [
                ['name', user.name]
            ])
            email(markdown, user.email, 'Atualização de conta');
			return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async disapproveUser({}, {}, { userID }){
        try {
            const user = await userModel.findById(userID);
			if (!user) return { error: "user_not_found" };
            const newUser = await userModel.findByIdAndUpdate(userID, { $set:{ status: 'blocked' } }, { new: true }).select('-password');
            const markdown = replaceMarkdown('disapprove', [
                ['name', user.name]
            ])
            email(markdown, user.email, 'Atualização de conta');
			return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async updateUser({ data }, {}, { userID }){
        try {
			const user = await userModel.findById(userID);
			if (!user) return { error: "user_not_found" };
            delete data.password;
            delete data._id;
            const newUser = await userModel.findByIdAndUpdate(userID, { $set:{ ...data } }, { new: true }).select('-password');
			return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    async deleteUser({}, {}, { userID }){
        try {
			const user = await userModel.findById(userID);
			if (!user) return { error: "user_not_found" };
			await userModel.findByIdAndDelete(userID);
			return { success: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
}