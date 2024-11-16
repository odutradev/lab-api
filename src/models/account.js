import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    space: {
        type: String
    }
});

export default mongoose.model('account', AccountSchema);