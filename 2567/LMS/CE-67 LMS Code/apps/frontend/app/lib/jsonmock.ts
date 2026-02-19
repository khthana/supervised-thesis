import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 *
 * This function return json data from a file
 *
 * @param jsonPath - jsonfile in public/json
 *
 * @return jsondata
 *
 * @example
 *
 */
async function getJsonData(jsonPath: string) {
	const filepath = process.cwd() + path.join(`/public/json/${jsonPath}`);
	const file = await fs.readFile(filepath, 'utf8');
	const data = JSON.parse(file);
	return data;
}

export default getJsonData;
