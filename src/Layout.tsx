import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Adjust the import path as needed

interface LayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	return (
		<div className='max-w-xl mx-auto'>
			<Header />
			<Outlet />
		</div>
	);
};

export default Layout;
