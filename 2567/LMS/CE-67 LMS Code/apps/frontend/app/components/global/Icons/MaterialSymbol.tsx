type MaterialSymbolProps = {
	name: string;
	fill?: number;
	weight?: number;
	grade?: number;
	opticalSize?: number;
	size?: string | number;
	color?: string;
	className?: string;
};

function MaterialSymbol({
	name,
	fill = 0,
	weight = 400,
	grade = 0,
	opticalSize = 24,
	size = 'medium',
	color = 'currentColor',
	className = '',
	...props
}: MaterialSymbolProps) {
	const safeWeight = Math.max(100, Math.min(700, weight));
	const safeFill = Math.max(0, Math.min(1, fill));
	const safeGrade = Math.max(-25, Math.min(200, grade));
	const safeOpticalSize = Math.max(20, Math.min(48, opticalSize));

	const style: React.CSSProperties = {
		fontFamily: '"Material Symbols Outlined"',
		fontWeight: 'normal',
		fontStyle: 'normal',
		fontSize: size,
		lineHeight: 1,
		letterSpacing: 'normal',
		textTransform: 'none',
		display: 'inline-block',
		whiteSpace: 'nowrap',
		wordWrap: 'normal',
		direction: 'ltr',
		fontVariationSettings: `'FILL' ${safeFill}, 'wght' ${safeWeight}, 'GRAD' ${safeGrade}, 'opsz' ${safeOpticalSize}`,
		color: color,
	};

	return (
		<span className={`material-symbols-outlined ${className}`} style={style} {...props}>
			{name}
		</span>
	);
}

export default MaterialSymbol;
