import React from 'react';
const Timer: React.FC<{ className?: string }> = (props) => {
	// const [totalTimer, currTimer, totalPause, currPause, mode] = useStore((state) => [state.timer, state.currTimer, state.pause, state.currPause, state.mode]);
	// const circleRadius = 150;
	// const circumference = circleRadius * 2 * Math.PI;

	return (
		<svg width={400} height={400} className={`circle-svg ${props.className}`}>
			<circle
				cx='50%'
				cy='50%'
				r={199}
				// r={circleRadius}
				// className='circle'
				// style={{
				// 	strokeDasharray: circumference, // circumference
				// 	strokeDashoffset: circumference * (mode === 'timer' ? 1 - currTimer / totalTimer : 1 - currPause / totalPause),
				// }}
			></circle>
		</svg>
	);
};
export default Timer;
