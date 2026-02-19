import { redis } from '@/common/utils/redis.util';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { type Job, Queue, Worker } from 'bullmq';

const createQueue = (name: string) => new Queue(name, { connection: redis });

async function setupVideoQueueWorker(queueName: string) {
	new Worker(
		queueName,
		async (job: Job) => {
			for (let i = 0; i <= 100; i++) {
				await Bun.sleep(Math.random());
				job.data = { ...job.data, i };
				await job.updateProgress(i);
				await job.log(`Processing job at interval ${i}`);

				if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
			}

			return { jobId: `This is the return value of job (${job.id})` };
		},
		{ connection: redis },
	);
}

export const videoQueue = createQueue('videoQueue');

await setupVideoQueueWorker('videoQueue');

export const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queue');

createBullBoard({
	queues: [new BullMQAdapter(videoQueue)],
	serverAdapter,
});
