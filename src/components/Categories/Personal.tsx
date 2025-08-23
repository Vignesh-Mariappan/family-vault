import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { uploadDocument } from '@/utils/uploadDocument'; // ✅ util function
import { getDoc, doc } from 'firebase/firestore';
import { auth, db, storage } from '@/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { UploadDrawer } from '../UploadDrawer';
import { Categories } from '@/utils/types';
import useGetUserRef from '@/hooks/useGetUserData';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { FileText, Share2, Download, Trash2, X } from 'lucide-react';
import {
	TooltipProvider,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
} from '@/components/ui/tooltip';
import { deleteObject, ref } from 'firebase/storage';
import { updateDoc } from 'firebase/firestore';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

import JSZip from 'jszip';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

const Personal: React.FC = () => {
	const [user] = useAuthState(auth);
	const [drawerOpen, setDrawerOpen] = React.useState(false);
	const [documents, setDocuments] = React.useState<any[]>([]);
	const { userData } = useGetUserRef();

	console.log('userData ', userData);

	useEffect(() => {
		if (userData) {
			setDocuments(userData.documents.PERSONAL || []);
		}
	}, [userData]);

	const handleDeleteDocument = async (
		documentId: string,
		files: { name: string; url: string }[]
	) => {
		if (!user || !userData) return;

		try {
			// Delete files from Firebase Storage
			await Promise.all(
				files.map(async (file) => {
					const fileRef = ref(storage, file.url); // Assuming the URL is the full path in storage
					await deleteObject(fileRef);
				})
			);

			// Remove document from user data in Firestore
			const userRef = doc(db, 'users', user.uid);
			const updatedDocuments = {
				...userData.documents,
				PERSONAL: userData.documents.PERSONAL.filter(
					(doc: any) => doc.id !== documentId
				),
			};

			await updateDoc(userRef, {
				documents: updatedDocuments,
			});

			// Update the local state
			setDocuments(updatedDocuments.PERSONAL);

			console.log('Document deleted successfully');
		} catch (error) {
			console.error('Error deleting document:', error);
			// Handle error (e.g., show a message to the user)
		}
	};

	const handleShareDocument = (document: any) => {
		// This is a basic implementation. You might want to use a dedicated sharing library
		// or implement a more robust sharing mechanism (e.g., generating a temporary share link).

		const shareText = `Check out my document: ${document.title}`;
		const shareUrl =
			document.files && document.files.length > 0 ? document.files[0].url : ''; // Use the URL of the first file

		if (navigator.share) {
			navigator
				.share({
					title: document.title,
					text: shareText,
					url: shareUrl,
				})
				.catch((error) => console.error('Error sharing:', error));
		}
	};

	const handleDownloadAll = async (document: any) => {
		if (!document.files || document.files.length === 0) {
			console.warn('No files to download for this document.');
			return;
		}

		const zip = new JSZip();

		try {
			await Promise.all(
				document.files.map(async (file: { name: string; url: string }) => {
					const response = await fetch(file.url);
					if (!response.ok)
						throw new Error(
							`Failed to fetch ${file.name}: ${response.statusText}`
						);
					const blob = await response.blob();
					zip.file(file.name, blob);
				})
			);

			const zipBlob = await zip.generateAsync({ type: 'blob' });
			const link = document.createElement('a');
			link.href = URL.createObjectURL(zipBlob);
			link.download = `${document.title}.zip`;
			link.click();
		} catch (error) {
			console.error('Error creating or downloading zip file:', error);
		}
	};

	const handleDownloadFile = async (file: { name: string; url: string }) => {
		try {
			const response = await fetch(file.url);
			if (!response.ok)
				throw new Error(`Failed to fetch ${file.name}: ${response.statusText}`);
			const blob = await response.blob();
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = file.name;
			link.click();
		} catch (error) {
			console.error('Error downloading file:', error);
		}
	};
	// ✅ Handle submit from UploadDrawer
	const handleUpload = async (title: string, files: File[]) => {
		if (!user?.uid) return;

		try {
			await uploadDocument(user.uid, Categories.PERSONAL, title, files);
			setDrawerOpen(false);
			console.log('Document is uploaded');
		} catch (error) {
			console.error('Error uploading document:', error);
		}
		// Fallback for browsers that don't support navigator.share
		alert(
			'Sharing is not supported in this browser. You can manually copy the link if available.'
		);
		console.log(`Document Title: ${document.title}`);
		console.log(`Document URL: ${shareUrl}`);
	};

	return (
		<div className='p-4'>
			<Button
				variant='outline'
				// size='icon'
				onClick={() => window.history.back()}
				className='mb-4'

			>
				Back to categories
				{/* Using X as a back arrow, you might replace this */}
			</Button>

			<h2 className='text-xl font-semibold mb-4'>Personal Documents</h2>

			{/* ✅ Upload Button */}
			<Button onClick={() => setDrawerOpen(true)}>Upload Document</Button>

			{/* ✅ Upload Drawer */}
			<div className='max-w-sm'>
				<UploadDrawer
					open={drawerOpen}
					onClose={() => setDrawerOpen(false)}
					onSubmit={handleUpload} // pass handler
				/>
			</div>

			{/* ✅ Show Uploaded Documents */}
			<div className='mt-6'>
				{documents.length > 0 ? (
					<TooltipProvider>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Document Name</TableHead>
									<TableHead className='text-right'>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{documents.map((doc, index) => (
									<TableRow key={doc.id || index}>
										<TableCell className='font-medium'>{doc.title}</TableCell>
										<TableCell className='text-right'>
											<div className='flex justify-end space-x-2'>
												{/* View Icon (Opens the first file in a new tab) */}
												{doc.files &&
													doc.files.length >= 0 && ( // Check if files array exists and has elements
														<Tooltip>
															<TooltipTrigger asChild>
																<Dialog>
																	<DialogTrigger asChild>
																		<Button
																			variant='ghost'
																			size='icon'
																			aria-label='View Documents'
																		>
																			<FileText className='h-4 w-4' />
																		</Button>
																	</DialogTrigger>
																	<DialogContent className='sm:max-w-[425px]'>
																		<DialogHeader>
																			<DialogTitle>
																				{doc.title} - Files
																			</DialogTitle>
																		</DialogHeader>
																		<div className='grid gap-4 py-4'>
																			{doc.files.map(
																				(file: any, fileIndex: number) => (
																					<div
																						key={fileIndex}
																						className='flex justify-between items-center'
																					>
																						<a
																							href={file.url}
																							target='_blank'
																							rel='noopener noreferrer'
																							className='text-blue-600 hover:underline'
																						>
																							{file.name}
																						</a>
																						<Button
																							variant='ghost'
																							size='sm'
																							aria-label={`Download ${file.name}`}
																							onClick={() =>
																								handleDownloadFile(file)
																							}
																						>
																							<Download className='h-4 w-4 mr-2' />
																							Download
																						</Button>
																					</div>
																				)
																			)}
																		</div>
																		<Separator />
																		<div className='flex justify-end'>
																			{doc.files.length > 0 && (
																				<Button
																					onClick={() => handleDownloadAll(doc)}
																				>
																					<Download className='h-4 w-4 mr-2 cursor-pointer' />
																					Download All
																				</Button>
																			)}
																		</div>
																	</DialogContent>
																</Dialog>
															</TooltipTrigger>
															<TooltipContent>
																<p>View Documents</p>
															</TooltipContent>
														</Tooltip>
													)}

												{/* Share Icon (Placeholder) */}
												<Tooltip>
													<TooltipTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															aria-label='Share Document'
														>
															<Share2
																className='h-4 w-4'
																onClick={() => handleShareDocument(doc)}
															/>
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>Share Document</p>
													</TooltipContent>
												</Tooltip>

												{/* Delete Icon */}
												<Tooltip>
													<TooltipTrigger asChild>
														<Popover>
															<PopoverTrigger asChild>
																<Button
																	variant='ghost'
																	size='icon'
																	aria-label='Delete Document'
																>
																	<Trash2 className='h-4 w-4 text-red-500' />
																</Button>
															</PopoverTrigger>
															<PopoverContent className='w-40'>
																<p className='text-sm mb-2'>Are you sure?</p>
																<Button
																	variant='destructive'
																	size='sm'
																	onClick={() =>
																		handleDeleteDocument(doc.id, doc.files)
																	}
																>
																	Yes, delete
																</Button>
															</PopoverContent>
														</Popover>
													</TooltipTrigger>
													<TooltipContent>
														<p>Delete Document</p>
													</TooltipContent>
												</Tooltip>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TooltipProvider>
				) : (
					<p className='text-gray-500'>No personal documents uploaded yet.</p>
				)}
			</div>
		</div>
	);
};

export default Personal;
