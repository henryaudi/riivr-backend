import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';

let bullAdapters: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
    bullAdapters.push(new BullAdapter(this.queue));

    // Remvoe duplicate adapters.
    bullAdapters = [...new Set(bullAdapters)];

    serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: bullAdapters,
      serverAdapter
    });

    this.log = config.createLogger(`${queueName}Queue`);

    // Listen to completed event and remove the job from the queue.
    this.queue.on('completed', (job: Job) => {
      job.remove();
    });

    // Listen to global completed events.
    this.queue.on('global:completed', (jobId: string) => {
      this.log.info(`Job with ID ${jobId} has been completed`);
    });

    // Listen to global stalled events.
    this.queue.on('global:stalled', (jobId: string) => {
      this.log.warn(`Job with ID ${jobId} is stalled`);
    });
  }
}
