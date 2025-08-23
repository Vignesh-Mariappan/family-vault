import { AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { TypographyH4 } from '@/components/ui/TypographyH4';
import useGetFamilyData from '@/hooks/useGetFamilyData';
import { getUserDataById } from '@/utils/getUserDataById';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileAlt } from 'react-icons/fa';

const Home: React.FC = () => {
	const familyData = useGetFamilyData();

	const [familyUsersData, setFamilyUsersData] = React.useState<any[]>([]);

	React.useEffect(() => {
		if (familyData.data) {
			Promise.all(
				familyData.data.members.map((memberId: string) =>
					getUserDataById(memberId)
				)
			).then((usersData) => {
				setFamilyUsersData(usersData);
			});
		}
	}, [familyData.data]);

	if (familyData.loading) {
		return <p>Loading family data...</p>;
	}

	if (familyData.error) {
		return <p>Error loading family data</p>;
	}

	return (
		<div className='flex flex-col gap-4 items-center justify-center'>
			<div className='flex flex-row gap-4 justify-center flex-wrap'>
				{familyUsersData?.map((member) => {
					console.log('member ', member);
					return (
						<Card key={member.uid} className='w-full max-w-84'>
							<CardContent className='flex flex-col items-center p-2'>
								<Avatar className='rounded-full w-20 h-20 mb-2'>
									{member.photoURL && (
										<AvatarImage
											className='rounded-full w-full h-full'
											src={member.photoURL}
											alt={member.displayName}
										/>
									)}
									<AvatarFallback>
										{member.displayName?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<CardTitle className='text-lg'>{member.displayName}</CardTitle>
								<CardDescription className='text-sm'>
									{member.email}
								</CardDescription>
								<CardDescription className='text-sm'>
									{member.role}
								</CardDescription>
								<Link to={`/member/${member.uid}`} className='mt-4'>
									<Button variant='default'>
										View Documents <FaFileAlt size={16} className='mr-2' />
									</Button>
								</Link>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
};

export default Home;
