import React, { useEffect } from 'react';
import logo from '../assets/logo/FamilyVault_Logo.png'; // Adjust the path if necessary
import { FcGoogle } from 'react-icons/fc'; // Importing the Google icon
import { loginWithGoogle } from '../utils/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Login: React.FC = () => {
	const [ user ] = useAuthState(auth);
	const navigate = useNavigate();

	useEffect(() => {
		// In a real application, you would check for authentication here (e.g., token in local storage, context API)
		// For now, we'll simulate it with a state that could be toggled
		if (user) {
			navigate('/');
		}
	}, [user, navigate]);

	return (
		<div className='flex flex-col items-center justify-center h-screen bg-background text-foreground'>
			<img
				src={logo}
				alt='FamilyVault Logo'
				className='mb-8 w-36 h-36 rounded-lg appear-from-top shadow-full'
			/>
			<Button
				onClick={loginWithGoogle}
				className='cursor-pointer'
			>
				Unlock Your Vault with {' '} <FcGoogle className='ml-2' /> {/* Google icon with right margin */}{' '}
			</Button>
		</div>
	);
};

export default Login;
