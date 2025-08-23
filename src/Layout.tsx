import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header'; // Adjust the import path as needed
import { Toaster } from 'sonner'


interface LayoutProps {
	children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
		checkDark();
		const observer = new MutationObserver(checkDark);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
		return () => observer.disconnect();
	}, []);

	const borderColor = isDark ? 'border-gray-900' : 'border-gray-200';

	return (
		<div className={`max-w-3xl mx-auto border-l border-r ${borderColor} min-h-screen`}>
			<Toaster position="top-right" richColors />
			<Header />
			<div className={`border-b ${borderColor} mb-4`} />
			<Outlet />
		</div>
	);
};

export default Layout;
