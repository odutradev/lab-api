import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
	space: {
		type: String,
	},
	creator: {
		type: String
	},
	parent: {
		type: String,
		description: "tarefa pai"
	},
	status: {
		type: String,
		enum: ['active', 'inactive', 'completed', 'pending', 'blocked'],
		default: 'active'
	},
	description: {
		type: String,
	},
	content: {
		type: String,
		description: "conteudo extra da task"
	},
	createAt:{
	  type: Date,
	  default: Date.now(),
	  description: "data de criação"
	},
	startIn: {
		type: Date,
		description: "timestamp de inicio da tarefa"
	},
	endIn: {
		type: Date,
		description: "timestamp de fim da tarefa"
	},
	deadline:{
		type: Date,
		description: "data limite"
	},
	lastUpdate:{
		type: Date,
		description: "ultima atualização"
	},
	scheduling: {
		type: Date,
		description: "agendamento para realização"
	},
	priority: {
		type: String,
		enum: ['high', 'medium', 'low'],  
		default: 'low',  
		description: 'nível de prioridade da tarefa',
	},
	identificator: {
		type: Number,
		description: "numero de criação da task"
	},
	index: {
		type: Number,
		description: "ordenação da task"
	},
});

export default mongoose.model('task', TaskSchema);
