import mongoose, { Types } from 'mongoose';

const UserSchema = new mongoose.Schema({
	name: String,
	email: {
	  type: String,
	  unique: true
	},
	password: String,
	role: {
		type: String,
		default: 'normal'
	},
	status: {
		type: String,
		default: 'registered'
	},
	contact: String,
	description: String,
	createAt:{
	  type: Date,
	  default: Date.now()
	},
	approvedAt:{
	  type: Date,
	},
	images: {
		avatar: String,
		banner: String
	},
	payload: {
		redirect: String,
		code: Number
	},
	spaces: [
		{
			id: Types.ObjectId,
			name: String,
			invite: Boolean,
			invitedBy: {
				name: String,
				id: String
			},
			entryDate: {
				type: Date,
				default: Date.now()
			},
			permissions: {
				type: Array,
				default: []
			},
			avatar: String
		}
	]
});

export default mongoose.model('user', UserSchema);
