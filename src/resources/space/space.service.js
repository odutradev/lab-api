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

    async getCompanyUsers({}, { companyID }){
        try {
            return await userModel.find({ "companies.id": companyID }).select('-password');
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getPublicCompanies(){
        try {
            return await spaceModel.find();
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getCompany({}, { companyID }){
        try {
            const company = await spaceModel.findById(companyID);
            if (!company) return { error: "company_not_found" };
            return company;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
    async updateCompany({ data }, { companyID, userID }){
        try {
			const company = await spaceModel.findById(companyID);
			if (!company) return { error: "company_not_found" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const userCompanyData = user.companies.find(x => x.id == companyID);
            const hasManagePermission = userCompanyData.permissions.find(x => x == "MANAGE_COMPANY");
            if (!hasManagePermission) return { error: "no_permission_to_execute"};
            const newCompany = await spaceModel.findByIdAndUpdate(companyID, { $set:{ ...data } }, { new: true });
			return newCompany;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}