import mongoose from 'mongoose';
import chalk from 'chalk';
import log from 'gulog';

const connectDB = async () => {
	try {
		var production = process.env.PRODUCTION
        mongoose.set('strictQuery', true)
		await mongoose.connect(production == true ? process.env.MONGOURI :  process.env.MONGOURI_TEST, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		});

        log.info(`Database connectada: ${chalk.green('mongoDB')}-${chalk.yellow(production == true ? 'production' : 'desenvolviment')}.`);
	} catch (err) {
        log.error('Erro ao connectar database.')
		console.error(err.message);
		process.exit(1);
	}
};

export default connectDB
