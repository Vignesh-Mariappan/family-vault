import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { auth } from '@/firebase/firebase';
import { inviteMember } from '@/utils/inviteMember';
import { UserRole } from '@/utils/types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';
import { useFamily } from '@/context/FamilyContext';


const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
});

const InviteMemberForm: React.FC= () => {
	const [ user ] = useAuthState(auth);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
		mode: 'onChange',
	});
	const { users } = useFamily();
	const userData = users?.find(currentUser => currentUser?.uid === user?.uid);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!userData || userData.role !== UserRole.Admin) {
			return null;
		}

		try {
			await inviteMember(values.email, userData.familyId);

			toast.success('Success! Family member invited! 🎉');
			// onInviteSuccess();
			form.reset(); // Clear the form after successful submission
		} catch (error) {
			console.error('Error inviting member:', error);
			// Optionally show an error message to the user
			toast.error('Error inviting family member. Please try again.');
		}
	}

	return (
		<div className='w-full max-w-md'>
			<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Share vault access</FormLabel>
							<FormControl>
								<Input placeholder='Add family member’s email
' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className='cursor-pointer' type='submit' disabled={!form.formState.isValid}>Send Invitation</Button>
			</form>
		</Form>
		</div>
	);
};

export default InviteMemberForm;
