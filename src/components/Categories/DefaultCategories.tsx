import { motion } from 'framer-motion'
import { FaIdCard, FaGraduationCap, FaBriefcase, FaHeart, FaWallet, FaHome } from 'react-icons/fa'
import { Card, CardContent } from '../ui/card'
import { useNavigate, useParams } from 'react-router-dom';

const DefaultCategories = () => {
  const { memberid } = useParams<{ memberid: string }>();
  const navigate = useNavigate();

  return (
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
        ].map((cat, index) => (
        <motion.div
            key={cat.route}
            className="flex flex-col gap-4 w-full max-w-[220px] mx-auto"
            onClick={() => navigate(`/categories/${memberid}/${cat.route}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.2 }}
        >
            <Card className={`flex flex-col items-center p-4 cursor-pointer h-40 justify-center shadow-md hover:scale-105 transition`}>
        <CardContent className="flex flex-col items-center p-0">
        {cat.icon}
        <p className={`mt-2 ${cat.fontColor}`}>{cat.label}</p>
        </CardContent>
            </Card>
        </motion.div>
        ))}
    </div>
  )
}

export default DefaultCategories