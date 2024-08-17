import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import userModel from "../../models/user.js";

export default class Service {

    async createUserPayload({ email, name, role, permissions, payload }){
        try {
            if (!email || !name) return { error: "no_data" };
            const hasUser = await userModel.findOne({ email });
            if (hasUser) return { error: "user_already_exists" };
            role = (role == process.env.ADMIN ? 'admin' : role);
            const user = new userModel({ email, name, role, permissions, payload });
            return await user.save();
        } catch (error) {
            return { error: "internal_error" } ;         
        }
    }

    async signInWithPayload({ email, password }){
        try {
            if (!email || !password) return { error: "no_credentials" };
            var user = await userModel.findOne({ email });
            if (!user) return { error: "user_not_found" };
            if (user.status != 'registered') return { error: "already_registered_user" };
            var salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
            var data = {
                loggedAt: Date.now(),
                status: 'logged',
                password,
            };
            user = await userModel.findByIdAndUpdate(user.id, { $set: data }, { new: true }).select('-password');
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT);
			return { token };
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

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
                loggedAt: Date.now(),
                status: 'logged',
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
    
}