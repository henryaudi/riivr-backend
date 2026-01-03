import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { chatService } from '@service/db/chat.service';

const log: Logger = config.createLogger('chatWorker');

class ChatWorker {
  async addChatMessageToDB(jobQueue: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = jobQueue;
      await chatService.addMessageToDB(data);
      jobQueue.progress(100);
      done(null, jobQueue.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}

export const chatWorker: ChatWorker = new ChatWorker();
