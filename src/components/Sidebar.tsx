import React, { useState } from 'react';
const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<aside className='h-full absolute left-0 bg-gray-800'>
			<ul>
				<li>home</li>
				<li>sessions</li>
				<li>preferences</li>
			</ul>
		</aside>
	);
};
export default Sidebar;
