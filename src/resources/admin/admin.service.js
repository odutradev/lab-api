import userModel from "../../models/user.js";
import email from "../../util/email.js";

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
            const newUser = await userModel.findByIdAndUpdate(userID, { $set:{ status: 'logged' } }, { new: true }).select('-password');
            const markdown = '# Hello world!\n\nThis is a **markdown** message'
            await email(markdown, user.email, 'Atualização de statu2s');
			return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async updateUser({ data }, {}, { userID }){
        try {
			const user = await userModel.findById(userID);
			if (!user) return { error: "user_not_found" };
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