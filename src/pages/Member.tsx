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

  const handleBackClick = () => {
    navigate(`/member/${memberid}`);
  };

  // ✅ Detect if we are on the base member route or a category route
  const isBaseRoute = location.pathname === `/member/${memberid}`;

  return (
    <div className="flex flex-col gap-4 items-center">
      <TypographyH4 text={memberDetails?.displayName} />

      {isBaseRoute ? (
        // ✅ Show category cards only on base member route
        <div className="flex justify-center items-center flex-wrap gap-4">
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/personal`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-blue-300 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaIdCard size={40} className="text-blue-800" />
                <p className="mt-2 text-blue-800">Personal</p>
              </CardContent>
            </Card>
          </div>
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/educational`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-green-300 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaGraduationCap size={40} className="text-green-800" />
                <p className="mt-2 text-green-800">Educational</p>
              </CardContent>
            </Card>
          </div>
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/professional`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-purple-300 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaBriefcase size={40} className="text-purple-800" />
                <p className="mt-2 text-purple-800">Professional</p>
              </CardContent>
            </Card>
          </div>
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/health`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-red-300 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaHeart size={40} className="text-red-800" />
                <p className="mt-2 text-red-800">Health</p>
              </CardContent>
            </Card>
          </div>
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/investments`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-yellow-100 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaWallet size={40} className="text-yellow-800" />
                <p className="mt-2 text-yellow-800">Investments</p>
              </CardContent>
            </Card>
          </div>
          <div
            className="flex flex-col gap-4 w-full max-w-[180px] mx-auto"
            onClick={() => navigate(`/member/${memberid}/home`)}
          >
            <Card className="flex flex-col items-center p-4 cursor-pointer bg-gray-100 h-40 justify-center">
              <CardContent className="flex flex-col items-center p-0">
                <FaHome size={40} className="text-gray-800" />
                <p className="mt-2 text-gray-800">Home</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // ✅ Show Outlet only on category routes
        <div className="w-full">
          <Outlet />
          <div className="mt-4">
            <button
              onClick={handleBackClick}
              className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-md hover:bg-purple-700"
            >
              Back to Categories
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Member;
