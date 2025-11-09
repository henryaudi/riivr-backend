import mongoose from 'mongoose';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    mongoose
      .connect(config.DATABASE_URL!)
      .then(() => {
        log.info('MongoDB connected successfully');
      })
      .catch((error) => {
        log.error('MongoDB connection error:', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('disconnected', connect);
};
