import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	status: {
		type: String,
		default: 'active'
	},
	permissions: {
		type: Array,
		default: []
	},
	contact: String,
	description: String,
	createAt:{
	  type: Date,
	  default: Date.now()
	},
	activeAt:{
	  type: Date,
	},
	images: {
		avatar: String,
		banner: String
	},
	payload: {
		redirect: String
	}
});

export default mongoose.model('company', CompanySchema);
