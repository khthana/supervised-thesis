import { Worker } from 'bullmq';
import { redis } from '@backend/common/utils/redis.util';

export const videoWorker = new Worker(
	'videoQueue',
	async (job) => {
		const { inputPath, outputDir } = job.data;

		console.log(`Processing video: ${inputPath}`);

		const resolutions = [
			{ label: '360p', size: '640x360', bitrate: '800k' },
			{ label: '720p', size: '1280x720', bitrate: '2500k' },
			{ label: '1080p', size: '1920x1080', bitrate: '5000k' },
		];

		// สร้าง process ทั้ง 3 สำหรับแต่ละ resolution
		const processes = resolutions.map(({ label, size, bitrate }) => {
			const outputPath = `${outputDir}/output_${label}.mp4`;
			console.log(`Generating: ${outputPath} (${size}, ${bitrate})`);

			return Bun.spawn(
				[
					'ffmpeg',
					'-i',
					inputPath,
					'-vf',
					`scale=${size}`,
					'-c:v',
					'libx264',
					'-preset',
					'fast',
					'-b:v',
					bitrate,
					'-c:a',
					'aac',
					'-b:a',
					'128k',
					outputPath,
				],
				{
					stdout: 'pipe',
					stderr: 'pipe',
				},
			);
		});

		// 🔹 รอให้ทุก Process ทำงานเสร็จ
		const results = await Promise.all(
			processes.map(async (proc) => {
				// รอให้ Process แต่ละตัวทำงานเสร็จ
				const stdout = await new Response(proc.stdout).text();
				const stderr = await new Response(proc.stderr).text();

				if (proc.exitCode !== 0) {
					console.error(`FFmpeg Error: ${stderr}`);
					throw new Error(`Transcoding failed: ${stderr}`);
				}

				console.log(`Transcoding Completed: ${stdout}`);
				return stdout; // ส่งกลับผลลัพธ์ stdout
			}),
		);

		console.log('✅ All Transcoding Jobs Completed');
		return results;
	},
	{ connection: redis },
);
