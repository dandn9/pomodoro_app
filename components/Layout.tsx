import React from 'react';
import Link from 'next/link';
const Layout = (props: React.PropsWithChildren) => {
	return (
		<main>
			<div className='absolute h-full bg-slate-700 z-50'>
				<ul className='px-2 mt-4'>
					<li>
						<Link href='/'>Home </Link>
					</li>

					<li>
						<Link href='/stats'>Stats</Link>
					</li>
				</ul>
			</div>
			{props.children}
		</main>
	);
};
export default Layout;
