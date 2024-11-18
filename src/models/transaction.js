import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    creator: {
		type: String
	},
    description: {
        type: String
    },
    type: {
        enum: ['input', 'output', 'blocked', 'investment', 'transfersBetweenAccounts'],  
        type: String
    },
    space: {
        type: String
    },
    category: {
        type: String
    },
    account: {
        type: String
    },
    value: {
        type: Number,
        default: 0
    },
    appellant: {
        untilIchange:{
            type: Boolean,
            description: "até eu finalizar"
        },
        active: {
            type: Boolean,
            default: false
        },
        repeat: {
            type: Number
        },
        repeatType: {
            type: String,
            enum: ["weekly", "monthly"]
        }
    }
});

export default mongoose.model('transaction', TransactionSchema);