import { useEffect, useState } from 'react';

export function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState<{
		width?: number;
		height?: number;
	}>({});

	useEffect(() => {
		function handleResize() {
			setWindowDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		}

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}
