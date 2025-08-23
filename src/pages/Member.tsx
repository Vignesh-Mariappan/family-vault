import { TypographyH4 } from '@/components/ui/TypographyH4';
import { getUserDataById } from '@/utils/getUserDataById';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import {
  FaIdCard,
  FaGraduationCap,
  FaBriefcase,
  FaHeart,
  FaWallet,
  FaHome,
} from 'react-icons/fa';
import { useParams, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const Member: React.FC = () => {
  const { memberid } = useParams<{ memberid: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [memberDetails, setMemberDetails] = React.useState<any>(null);

  React.useEffect(() => {
    if (memberid) {
      getUserDataById(memberid).then((data) => setMemberDetails(data));
    }
  }, [memberid]);

  // ✅ Detect if we are on the base member route or a category route
  const isBaseRoute = location.pathname === `/member/${memberid}`;

  return (
    <div className="flex flex-col gap-4 items-center">
      

      {isBaseRoute ? (
        // ✅ Show category cards only on base member route
        <>
          <Button
            variant='outline'
            onClick={() => navigate('/')}
            className='mb-4 ml-8 self-start cursor-pointer'

          >
            <ChevronLeft className='h-4 w-4' />
            Back to Home
            {/* Using X as a back arrow, you might replace this */}
          </Button>
          <TypographyH4 text={memberDetails?.displayName} />
          <div className="flex justify-center items-center flex-wrap gap-4 m-4">
          {[
            {
              label: 'Personal',
              icon: <FaIdCard size={40} className="text-blue-600 drop-shadow" />,
              route: 'personal',
              gradient: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500',
              textColor: 'text-blue-700',
              fontColor: 'text-blue-700',
            },
            {
              label: 'Educational',
              icon: <FaGraduationCap size={40} className="text-green-600 drop-shadow" />,
              route: 'educational',
              gradient: 'bg-gradient-to-br from-green-300 via-green-400 to-green-500',
              textColor: 'text-green-700',
              fontColor: 'text-green-700',
            },
            {
              label: 'Professional',
              icon: <FaBriefcase size={40} className="text-purple-600 drop-shadow" />,
              route: 'professional',
              gradient: 'bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500',
              textColor: 'text-purple-700',
              fontColor: 'text-purple-700',
            },
            {
              label: 'Health',
              icon: <FaHeart size={40} className="text-red-500 drop-shadow" />,
              route: 'health',
              gradient: 'bg-gradient-to-br from-pink-300 via-pink-400 to-red-500',
              textColor: 'text-red-600',
              fontColor: 'text-red-600',
            },
            {
              label: 'Investments',
              icon: <FaWallet size={40} className="text-yellow-600 drop-shadow" />,
              route: 'investments',
              gradient: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500',
              textColor: 'text-yellow-700',
              fontColor: 'text-yellow-700',
            },
            {
              label: 'Home',
              icon: <FaHome size={40} className="text-sky-700 drop-shadow" />,
              route: 'home',
              gradient: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
              // textColor: 'text-gray-800',
              // fontColor: 'text-gray-800',
              textColor: 'text-sky-700',
              fontColor: 'text-sky-700',
            },
          ].map((cat) => (
            <div
              key={cat.route}
              className="flex flex-col gap-4 w-full max-w-[220px] mx-auto"
              onClick={() => navigate(`/member/${memberid}/${cat.route}`)}
            >
              <Card className={`flex flex-col items-center p-4 cursor-pointer h-40 justify-center shadow-md hover:scale-105 transition`}>
          <CardContent className="flex flex-col items-center p-0">
            {cat.icon}
            <p className={`mt-2 ${cat.fontColor}`}>{cat.label}</p>
          </CardContent>
              </Card>
            </div>
          ))}
        </div>
        </>
      ) : (
        // ✅ Show Outlet only on category routes
        <div className="w-full">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Member;
