import { pino } from 'pino';

export const logger = pino({
	name: 'server start',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:standard',
			ignore: 'pid,hostname',
		},
	},
});
