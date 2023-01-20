import React, { useMemo } from 'react';

interface TimerProps {
	progress: number; // should be a number between 0 and 1
	radius: number;
	className?: string;
	strokeWidth?: number;
}
// progress should be
const Timer: React.FC<TimerProps> = ({
	progress,
	radius,
	strokeWidth = 10,
	className,
}) => {
	console.log('progress', progress);
	const circumference = useMemo(() => radius * 2 * Math.PI, [radius]);
	return (
		<svg
			width={radius * 2 + strokeWidth}
			height={radius * 2 + strokeWidth}
			className={className}
		>
			<circle
				cx='50%'
				cy='50%'
				r={radius}
				className='transition-all'
				style={{
					fill: 'none',
					strokeDasharray: circumference,
					strokeDashoffset: circumference * (1 - progress),
					strokeLinejoin: 'round',
					strokeLinecap: 'round',
					strokeWidth: strokeWidth,
				}}
			></circle>
		</svg>
	);
};
export default Timer;
