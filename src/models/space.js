import mongoose from 'mongoose';

const SpaceSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	creator: {
		type: String
	},
	status: {
		type: String,
		default: 'active'
	},
	description: String,
	createAt:{
	  type: Date,
	  default: Date.now()
	},
	images: {
		avatar: String,
		banner: String
	},
	payload: {
		redirect: String
	},
	tasksCounter: {
		type: Number,
		default: 0
	}
});

export default mongoose.model('space', SpaceSchema);
