import InviteMemberForm from '@/components/InviteMemberForm';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { TypographyH2 } from '@/components/ui/TypographyH2';
import { TypographyH4 } from '@/components/ui/TypographyH4';
import { auth, db } from '@/firebase/firebase';
import useGetFamilyData from '@/hooks/useGetFamilyData';
import useGetUserData from '@/hooks/useGetUserData';
import { logout } from '@/utils/auth';
import { UserRole } from '@/utils/types';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { arrayRemove, doc, getDoc, updateDoc, } from 'firebase/firestore';
import {  Trash2, MailPlus, Shield, User2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

const Profile: React.FC = () => {
	const [loggedInUser] = useAuthState(auth);
	const { userData: user, loading, error } = useGetUserData(loggedInUser?.uid || '');
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

	const handleDeleteInvite = async (email: string) => {
		const familyId = familyData.data?.uid || user?.familyId;
		if (!familyId) return;
		try {
			await updateDoc(doc(db, 'families', familyId), {
				invites: arrayRemove(email),
			});

			toast.success('Invite removed successfully!');
		} catch (err) {
			console.error('Error removing invite:', err);
			toast.error('Error removing invite. Please try again.');
		}
	};

	const renderInvitedMembers = (invitedMembers: string[]) => (
		<div className='text-center w-full max-w-md p-4'>
			<TypographyH4 text={'Vault Invites'} />
			{invitedMembers.length === 0 ? (
				<div className="flex mt-4 flex-col items-center justify-center py-8 bg-muted rounded-lg border border-dashed border-gray-300">
					<MailPlus className="h-8 w-8 text-muted-foreground mb-2" />
					<p className="text-muted-foreground text-base font-medium">
  						No invitations sent yet. Invite your loved ones to join
					</p>
				</div>
			) : (
				<Table className='w-full '>
					<TableBody>
						{invitedMembers.map((email, index) => (
							<TableRow key={email ?? index}>
								<TableCell className="flex items-center justify-between">
									<span>{email}</span>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												aria-label="Delete Invite"
												className='z-1'
											>
												<Trash2 className="w-4 h-4 text-red-500" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="p-4 shadow-md rounded-md border z-10 bg-background">
											<div className="flex flex-col items-center gap-4">
												<span className="text-sm text-center">
													Are you sure you want to remove the invitation?
												</span>
												<div className="flex gap-2">
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDeleteInvite(email)}
													>
														Yes
													</Button>
													<PopoverClose asChild>
														<Button className='cursor-pointer' variant="outline" size="sm">
															No
														</Button>
													</PopoverClose>
												</div>
											</div>
										</PopoverContent>
									</Popover>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);

	const renderFamilyMembers = (familyMembersData: UserData[] | null) => (
		<div className='w-full max-w-xl p-4'>
			<TypographyH4 text={'Vault Members'} additionalClasses='text-center' />
			<Table className='w-full mt-4'>
				<TableHeader>
					<TableRow>
						<TableHead>Member</TableHead>
						<TableHead>Role</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{familyMembersData?.map((member, index) => (
						<TableRow key={member?.uid ?? index}>
							<TableCell>{member?.displayName}</TableCell>
							<TableCell>
								{member?.role === UserRole.Admin ? (
									<Badge className="bg-blue-500 text-white dark:bg-blue-600">
										{/* Shield icon from lucide-react */} 
										<Shield className="inline-block mr-1 h-4 w-4" />
										Admin
									</Badge>
								) : (
									<Badge>
										{/* User icon from lucide-react */}
										<User2 className="inline-block mr-1 h-4 w-4" />
										Member
									</Badge>
								)}
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

	// if (!user) {
	// 	return <div>Loading profile...</div>;
	// }

	if (loading || familyData.loading) {
		return (
			<div className="flex flex-col items-center gap-4 my-8 p-4 w-full max-w-md mx-auto">
				<div className="flex flex-col items-center gap-2">
					<div className="rounded-full bg-stone-800 animate-pulse w-[100px] h-[100px]" />
					<div className="h-6 w-32 bg-stone-800 rounded animate-pulse" />
				</div>
				<div className="w-full m-6">
					<div className="h-5 w-24 bg-stone-800 rounded animate-pulse mx-auto mb-2" />
					<div className="border rounded-lg p-4 mx-4">
						<div className="flex flex-row justify-between mb-2">
							<div className="h-4 w-20 bg-stone-800 rounded animate-pulse" />
							<div className="h-4 w-16 bg-stone-800 rounded animate-pulse" />
						</div>
						<div className="flex flex-row justify-between">
							<div className="h-4 w-20 bg-stone-800 rounded animate-pulse" />
							<div className="h-4 w-16 bg-stone-800 rounded animate-pulse" />
						</div>
					</div>
				</div>
				<div className="w-full m-6">
					<div className="h-5 w-24 bg-stone-800 rounded animate-pulse mx-auto mb-2" />
					<div className="border rounded-lg p-4  mx-4">
						<div className="h-4 w-32 bg-stone-800 rounded animate-pulse mb-2" />
						<div className="h-4 w-32 bg-stone-800 rounded animate-pulse" />
					</div>
				</div>
				<div className="h-10 w-32 bg-stone-800 rounded animate-pulse m-6" />
			</div>
		);
	}

	if (error) return <div>Error loading profile</div>;

	return (
		<div className='flex flex-col items-center gap-10 my-8 p-4'>
			{user?.photoURL && (
				<img
					src={user?.photoURL}
					alt={`${user?.displayName}'s profile`}
					width='100'
					height='100'
					className='rounded-md'
				/>
			)}
			<TypographyH2 text={user?.displayName} />
			{user?.role === UserRole.Admin && <InviteMemberForm />} {renderFamilyMembers(familyMembersData)}


			{familyData.data?.invites &&
				renderInvitedMembers(familyData.data.invites)}

			<Button className='cursor-pointer' variant="destructive" onClick={logout}>Logout</Button>
		</div>
	);
};

export default Profile;
