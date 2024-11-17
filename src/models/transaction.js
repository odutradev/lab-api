import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    type: {
		enum: ['input', 'output', 'blocked', 'investment'],  
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
            type: number
        },
        repeatType: {
            enum: ["weekly", "monthly"]
        }
    }
});

export default mongoose.model('transaction', TransactionSchema);