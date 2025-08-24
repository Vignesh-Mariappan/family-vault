import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Adjust the import path as needed
import { Toaster } from 'sonner'

interface LayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
	return (
		<div className={`max-w-3xl mx-auto border-l border-r min-h-screen`}>
			<Toaster position="top-right" richColors />
			<Header />
			<div className={`border-b mb-4`} />
			<Outlet />
		</div>
	);
};

export default Layout;
