export async function isEnglishAlphaInput(testString: string): Promise<boolean> {
	const isEng = /^[a-zA-Z\s]*$/;
	return isEng.test(testString);
}
