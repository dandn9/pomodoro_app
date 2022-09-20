import React, { useEffect } from 'react';

const useClickOutside = (
	ref: React.RefObject<HTMLElement>,
	cb: (event: MouseEvent | TouchEvent) => void,
	...exceptions: React.RefObject<HTMLElement>[]
) => {
	useEffect(() => {
		console.log('aa', ref, cb);
		const handler = (event: MouseEvent | TouchEvent) => {
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}
			let isInException = false;
			if (exceptions.length > 0) {
				exceptions.forEach((exception) => {
					if (exception.current) {
						if (exception.current.contains(event.target as Node)) {
							isInException = true;
						}
					}
				});
			}
			if (!isInException) {
				cb(event);
			}
		};

		document.addEventListener('mousedown', handler);
		document.addEventListener('touchstart', handler);

		return () => {
			document.removeEventListener('mousedown', handler);
			document.removeEventListener('touchstart', handler);
		};
	}, [ref, cb, exceptions]);
};
export default useClickOutside;
