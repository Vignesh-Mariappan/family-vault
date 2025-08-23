import React from 'react';
import logo from '../assets/logo/FamilyVault_Logo.png'; // Adjust the path as needed
import useGetUserData from '@/hooks/useGetUserData';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { TypographyH4 } from './ui/TypographyH4';

const Header: React.FC = () => {
	const { userData: user, loading, error } = useGetUserData();
	return (
		<header className='flex justify-between items-center p-4'>
			{/* Logo on the left */}
			<div className='flex items-center'>
				<Link to='/'>
					<img src={logo} alt='FamilyVault Logo' className='h-10' />
				</Link>
			</div>

			<TypographyH4 text="FamilyVault" />

			{/* Profile image on the right */}
			<div className='flex items-center h-10 w-10'>
				{user?.photoURL && (
					<Link to='/profile'>
						<Avatar className='rounded-full cursor-pointer'>
							{user?.photoURL !== null && (
								<AvatarImage
									src={user?.photoURL}
									className='h-full w-full rounded-full'
								/>
							)}
							<AvatarFallback>{user?.displayName?.slice(0, 2)}</AvatarFallback>
						</Avatar>
					</Link>
				)}
			</div>
		</header>
	);
};

export default Header;
