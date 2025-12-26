import Queue, { Job } from 'bull';
import Logger from 'bunyan';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IEmailJob } from '@user/interfaces/user.interface';
import { IPostJobData } from '@post/interfaces/post.interface';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ICommentJob } from '@comment/interfaces/comment.interface';
import { IFollowerJobData } from '@follower/interfaces/follower.interface';
import { INotificationJobData } from '@notification/interfaces/notification.interface';

type IBaseJobData =
  | IAuthJob
  | IEmailJob
  | IPostJobData
  | IReactionJob
  | ICommentJob
  | IFollowerJobData
  | INotificationJobData;

let bullAdapters: BullAdapter[] = [];

export let serverAdapter: ExpressAdapter;

export abstract class BaseQueue {
  queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, `${config.REDIS_HOST}`);

    // Set up Bull Board adapter for this queue.
    bullAdapters.push(new BullAdapter(this.queue));

    // Remove duplicate adapters.
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

  /**
   * Enqueues a job with retry and backoff defaults.
   * The job is stored under the supplied name so registered processors can pick it up.
   *
   * @param name - Identifier for the job type.
   * @param data - Payload passed to the worker when the job runs.
   */
  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: 'fixed', delay: 5000 }
    });
  }

  /**
   * Registers a processor for jobs with the provided name.
   * Bull will invoke the callback for each matching job as they arrive,
   * respecting the specified concurrency limit.
   *
   * @param name - Job name to bind the processor to.
   * @param concurrency - Maximum number of jobs to run in parallel.
   * @param callback - Handler that performs the actual job work.
   */
  protected processJob(name: string, concurrency: number, callback: Queue.ProcessCallbackFunction<void>): void {
    this.queue.process(name, concurrency, callback);
  }
}
