function IconLearnify({ size }: { size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }) {
	const textSizeClass =
		size === 'sm'
			? 'text-sm'
			: size === 'md'
				? 'text-md'
				: size === 'lg'
					? 'text-lg'
					: size === 'xl'
						? 'text-xl'
						: 'text-2xl';

	return (
		<div className={textSizeClass}>
			<b className='flex'>
				<p className={`${textSizeClass} text-[#FD9E02]`}>CE</p> &nbsp;
				<p className={`${textSizeClass} text-[#374557] dark:text-[#B4B4B4]`}>Learnify</p>
				<p className={`${textSizeClass} text-[#FD9E02]`}>.</p>
			</b>
		</div>
	);
}

export default IconLearnify;
