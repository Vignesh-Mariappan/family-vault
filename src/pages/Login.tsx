import React, { useEffect } from 'react';
import logo from '../assets/logo/FamilyVault_Logo.png'; // Adjust the path if necessary
import { FcGoogle } from 'react-icons/fc'; // Importing the Google icon
import { loginWithGoogle } from '../utils/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';

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
			<button
				className='cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-400 text-black hover:from-yellow-600 hover:to-yellow-700 flex items-center px-4 py-2 border rounded-md bg-primary shadow-lg text-black'
				onClick={loginWithGoogle}
			>
				Unlock Your Vault with {' '} <FcGoogle className='ml-2' /> {/* Google icon with right margin */}{' '}
			</button>
		</div>
	);
};

export default Login;
