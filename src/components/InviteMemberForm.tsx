import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
import { inviteMember } from '@/utils/inviteMember';
import useGetUserRef from '@/hooks/useGetUserData';
import { UserRole } from '@/utils/types';

const formSchema = z.object({
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
});

const InviteMemberForm: React.FC= () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
		},
	});
	const { userData, loading, error } = useGetUserRef();

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (!userData || userData.role !== UserRole.Admin) {
			return null;
		}

		try {
			await inviteMember(values.email, userData.familyId);
			// Optionally show a success message or clear the form
			console.log('Invitation sent successfully!');
			// onInviteSuccess();
			form.reset(); // Clear the form after successful submission
		} catch (error) {
			console.error('Error inviting member:', error);
			// Optionally show an error message to the user
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder='Enter member email' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Invite Member</Button>
			</form>
		</Form>
	);
};

export default InviteMemberForm;
