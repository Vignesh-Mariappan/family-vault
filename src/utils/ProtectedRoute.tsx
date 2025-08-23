import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	if (user) {
		return <>{children}</>;
	}

	return null; // Or a loading spinner
};

export default ProtectedRoute;
