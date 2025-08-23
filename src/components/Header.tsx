import React, { useState, useEffect } from 'react';
import logo from '../assets/logo/FamilyVault_Logo.png';
import useGetUserData from '@/hooks/useGetUserData';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Link } from 'react-router-dom';
import { TypographyH4 } from './ui/TypographyH4';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
    const [loggedInUser ] = useAuthState(auth)
    const { userData: user } = useGetUserData(loggedInUser?.uid || '');

    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            setIsDark(false);
        } else {
            html.classList.add('dark');
            setIsDark(true);
        }
    };

    return (
        <header className='flex justify-between items-center p-4'>
            {/* Logo on the left */}
            <div className='flex items-center'>
                <Link to='/'>
                    <img src={logo} alt='FamilyVault Logo' className='h-10' />
                </Link>
            </div>

            <TypographyH4 
                text="FamilyVault" 
                additionalClasses="bg-gradient-to-r from-yellow-500 to-yellow-600 text-transparent bg-clip-text max-[500px]:hidden"
            />

			<div className="flex gap-4 items-center justify-center">
				<button
                    onClick={toggleTheme}
                    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    className="p-2 rounded-full hover:bg-muted transition"
                >
                    {isDark ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                        <Moon className="h-5 w-5 text-gray-700" />
                    )}
                </button>

				{/* Theme toggle and profile image on the right */}
				<div className='flex items-center h-10 w-10 gap-4'>
					
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
				</div>
			</div>
        </header>
    );
};

export default Header;
