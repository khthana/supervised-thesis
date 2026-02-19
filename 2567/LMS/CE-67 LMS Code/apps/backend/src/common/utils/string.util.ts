export function censorEmail(email: string) {
	return email.replace(/^(.)(.*?)(@.)(.*)(..*)$/, (_, first, _hidden, at, _domainHidden, last) => {
		return `${first}***${at}****${last}`;
	});
}
