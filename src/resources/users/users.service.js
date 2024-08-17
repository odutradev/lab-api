import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import replaceMarkdown from "../../util/replaceMarkdown.js";
import secretFunction from "../../util/secret.js";
import userModel from "../../models/user.js";
import sendEmail from "../../util/email.js";

export default class Service {

    async signIn({email, password }){
        try {
            if (!email || !password) return { error: "no_credentials" };
            const user = await userModel.findOne({ email });
            if (!user) return { error: "user_not_found" };
            var isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) return { error: "invalid_credentials"};
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
			return { token };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
	
    async signUp({email, name, password, payload}){
        try {
            if (!email || !password || !name) return { error: "no_credentials" };
            const hasUser = await userModel.findOne({ email });
            if (hasUser) return { error: "user_already_exists" };
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            var data = {
                createAt: Date.now(),
                status: 'pending',
                password, 
                payload,
                email, 
                name,
            }
            const user = new userModel(data);
            await user.save();
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
            return { token };		 
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
	
    async me({}, { userID }){
        try {
            const user = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found" };
            return user;	
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
	
    async update({ data }, { userID }){
        try {
            const user = await userModel.findById(userID);
            if (!user) return { error: "user_not_found" };
            const newUser = await userModel.findByIdAndUpdate(userID, { $set:{ ...data } }, { new: true }).select('-password');
            return newUser;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async requestResetPassword({ email }){
        try {
            const user = await userModel.findOne({ email });
            if (!user) return { error: "user_not_found" };
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            await userModel.findOneAndUpdate({ email }, { $set:{ payload: { code }} }, { new: true });
            const markdown = replaceMarkdown('requestResetPassword', [
                ['email', email],
                ['code', code]
            ]);
            await sendEmail(markdown, email, 'Redefinição de senha');
            return;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async resetPassword({ email, code, password}){
        try {
            const user = await userModel.findOne({ email });
            if (!user) return { error: "user_not_found" };
            if (!(user.payload.code == code)) return { error: "invalid_code" };
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            await userModel.findOneAndUpdate({ email }, { $set:{ payload: {}, password } }, { new: true });
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
            return { token };		
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async validateResetPasswordCode({ email, code }){
        try {
            const user = await userModel.findOne({ email });
            if (!user) return { error: "user_not_found" };
            if (!(user.payload.code == code)) return { error: "invalid_code" };
            return { authorized: true };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async secret({}, {}, { userID, script }){
        try {
            const user = await userModel.findById(userID);
            if (!user) return { error: "user_not_found" };
            return await secretFunction(userID, script);
        } catch (err) {
            console.log(err)
            return { error: "internal_error" } ;
        }
    }
    
}