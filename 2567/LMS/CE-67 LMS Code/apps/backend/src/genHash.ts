import type { z } from 'zod';

import { validation } from '@shared/types/common/validation';

const StrongPasswordSchema = validation.StrongPasswordSchema;
type StrongPassword = z.infer<typeof StrongPasswordSchema>;

async function genHash(input: StrongPassword) {
	const hashUserPassword = await Bun.password.hash(input, {
		algorithm: 'argon2id', // the algorithm to use
		memoryCost: 20 * 1024, // memory usage in kibibytes
		timeCost: 2, // the number of iterations
	});
	return hashUserPassword;
}

const password = '1234@passWord';

const hash = await genHash(password);

console.log(hash);
