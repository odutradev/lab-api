import accountModel from "../../models/account.js";

export default class Service {
    async createAccount({ name, description }, { spaceID }){
        try {
            const hasAccount = await accountModel.findOne({ name });
            if (hasAccount) return { error: "account_already_exists" };

            const account = new accountModel({
                space: spaceID,
                description,
                name
            });

            await account.save();

            return account;
        } catch (err) {
            return { error: "internal_error" };
        }
    };
    async getAccounts({}, { spaceID }){
        try {
            return await accountModel.find({ space: spaceID });
        } catch (err) {
            return { error: "internal_error" };
        }
    };
};