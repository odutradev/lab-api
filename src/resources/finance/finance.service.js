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

    async getAccountById({}, {}, { accountID }){
        try {
            const account = await accountModel.findById(accountID);
            if (!account) return { error: "account_not_found" };

            return account;
        } catch (err) {
            return { error: "internal_error" };
        }
    };

    async deleteAccountById({}, {}, { accountID }){
        try {
            const account = await accountModel.findById(accountID);
            if (!account) return { error: "account_not_found" };

            await accountModel.findByIdAndDelete(account._id)

            return { success: true };
        } catch (err) {
            return { error: "internal_error" };
        }
    };

    async updateAccountById({ data }, {}, { accountID }){
        try {
            const account = await accountModel.findById(accountID);
            if (!account) return { error: "account_not_found" };

            return await accountModel.findByIdAndUpdate(accountID, { $set: data }, { new: true });
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