import transactionModel from "../../models/transaction.js";
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
    async createTransaction({ description, type, category, value, appellant}, { spaceID, userID }, { accountID }){
        try {
            const account = await accountModel.findById(accountID);
            if (!account) return { error: "account_not_found" };

            const transaction = new transactionModel({
                account: accountID,
                creator: userID,
                space: spaceID,
                description,
                appellant,
                category,
                value,
                type,
            });

            await transaction.save();

            return transaction;
        } catch (err) {
            return { error: "internal_error" };
        }
    };

    async deleteTransactionById({}, {}, { transactionID }){
        try {
            const transaction = await transactionModel.findById(transactionID);
            if (!transaction) return { error: "transaction_not_found" };

            await transactionModel.findByIdAndDelete(transaction._id)

            return { success: true };
        } catch (err) {
            return { error: "internal_error" };
        }
    };
    
    async getTransactions({}, {}, { accountID }){
        try {
            return await transactionModel.find({ account: accountID });
        } catch (err) {
            return { error: "internal_error" };
        }
    };

    async updateTransactionsById({ data }, {}, { transactionID }){
        try {
            const transaction = await transactionModel.findById(transactionID);
            if (!transaction) return { error: "transaction_not_found" };

            return await transactionModel.findByIdAndUpdate(transactionID, { $set: data }, { new: true });
        } catch (err) {
            console.log(err)
            return { error: "internal_error" };
        }
    };
    
};