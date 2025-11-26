import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogle } from '../utils/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FaVault } from "react-icons/fa6";

const Login: React.FC = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        // Trigger the animation after a short delay
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, 500); // ms delay
        return () => clearTimeout(timer);
    }, []);



    return (
        <div className="flex items-center justify-center h-screen text-foreground overflow-hidden">
            <motion.div
                className="flex flex-col items-center"
                initial={{ y: 0 }}
                animate={{ y: isAnimated ? -50 : 0 }}
                transition={{ type: 'spring', stiffness: 50, damping: 10, duration: 1.5 }}
            >
                <FaVault className="w-24 h-24 md:w-32 md:h-32 mb-8 text-primary" />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isAnimated ? 1 : 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    <Button onClick={loginWithGoogle} className="cursor-pointer">
                        Unlock Your Vault with <FcGoogle className="ml-2" />
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
