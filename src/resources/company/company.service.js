import companyModel from "../../models/space.js";
import userModel from "../../models/user.js";

export default class Service {

    async createCompany({ name, permissions, payload }, { userID }){
        try {
            const hasCompany = await companyModel.findOne({ name });
            if (hasCompany)  return { error: "company_already_exists" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            if (user.companies.length > 1) return { error: "company_limit_reached"};
            const company = new companyModel({
                activeAt: Date.now(),
                admin: userID,
                permissions,
                payload,
                name,
            });
            await company.save();
            user.companies = [
                ...user.companies,
                 {
                    entryDate: Date.now(),
                    id: company._id,
                    permissions: [
                        'MANAGE_COMPANY'
                    ],
                    name,
                }
            ];
            await user.save();
            return { company, user };
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
            return await companyModel.find();
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

    async getCompany({}, { companyID }){
        try {
            const company = await companyModel.findById(companyID);
            if (!company) return { error: "company_not_found" };
            return company;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }
    
    async updateCompany({ data }, { companyID, userID }){
        try {
			const company = await companyModel.findById(companyID);
			if (!company) return { error: "company_not_found" };
            const user  = await userModel.findById(userID).select('-password');
            if (!user) return { error: "user_not_found"};
            const userCompanyData = user.companies.find(x => x.id == companyID);
            const hasManagePermission = userCompanyData.permissions.find(x => x == "MANAGE_COMPANY");
            if (!hasManagePermission) return { error: "no_permission_to_execute"};
            const newCompany = await companyModel.findByIdAndUpdate(companyID, { $set:{ ...data } }, { new: true });
			return newCompany;
        } catch (err) {
            return { error: "internal_error" } ;
        }
    }

}