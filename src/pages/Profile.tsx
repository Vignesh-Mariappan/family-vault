import InviteMemberForm from '@/components/InviteMemberForm';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableCaption,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { TypographyH2 } from '@/components/ui/TypographyH2';
import { TypographyH4 } from '@/components/ui/TypographyH4';
import { db } from '@/firebase/firebase';
import useGetFamilyData from '@/hooks/useGetFamilyData';
import useGetUserData from '@/hooks/useGetUserData';
import { logout } from '@/utils/auth';
import { UserRole } from '@/utils/types';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const Profile: React.FC = () => {
	// const [user] = useAuthState(auth);
	const { userData: user, loading, error } = useGetUserData();
	const familyData = useGetFamilyData();

	const fetchMembers = async (members: string[]) => {
		const memberData = await Promise.all(
			members.map(async (memberId) => {
				const memberDoc = await getDoc(doc(db, 'users', memberId));
				return memberDoc.data();
			})
		);

		console.log('memberData ', memberData);
		return memberData;
	};

	const renderInvitedMembers = (invitedMembers: string[]) => (
		<div className='text-center'>
			<TypographyH4 text={'Invited Members'} />
			<Table className='w-[500px] max-w-[500px] mx-auto'>
				<TableBody>
					{invitedMembers?.map((email, index) => (
						<TableRow key={email ?? index}>
							<TableCell>{email}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);

	const renderFamilyMembers = (familyMembersData: UserData[] | null) => (
		<div className=''>
			<TypographyH4 text={'Family Members'} additionalClasses='text-center' />
			<Table className='max-w-[500px] mx-auto'>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[100px]'>Member</TableHead>
						<TableHead>Role</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{familyMembersData?.map((member, index) => (
						<TableRow key={member?.uid ?? index}>
							<TableCell>{member?.displayName}</TableCell>
							<TableCell>
								{member?.role === UserRole.Admin ? 'Admin' : 'Member'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
	const [familyMembersData, setFamilyMembersData] = useState<UserData[] | null>(
		null
	);

	useEffect(() => {
		const getAndSetMembers = async () => {
			if (familyData.data?.members) {
				const data = await fetchMembers(familyData.data.members);
				setFamilyMembersData(data);
			}
		};
		getAndSetMembers();
	}, [familyData.data?.members]);

	console.log('Family Members Data ', familyMembersData);

	if (!user) {
		return <div>Loading profile...</div>;
	}

	if (loading) {
		return <div>Loading profile...</div>;
	}

	if (error) return <div>Error loading profile: {error.message}</div>;

	return (
		<div className='flex flex-col items-center gap-10 mt-8'>
			{user.photoURL && (
				<img
					src={user.photoURL}
					alt={`${user.displayName}'s profile`}
					width='100'
					height='100'
				/>
			)}
			<TypographyH2 text={user.displayName} />
			{user.role === UserRole.Admin && <InviteMemberForm />} {renderFamilyMembers(familyMembersData)}


			{familyData.data?.invites &&
				renderInvitedMembers(familyData.data.invites)}

			<Button variant="destructive" onClick={logout}>Logout</Button>
		</div>
	);
};

// npm install zod react-hook-form @hookform/resolvers zod

export default Profile;
