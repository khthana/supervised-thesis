import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';

interface PopupProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	popupBody: string;
	onClose: () => void;
	buttonString: string;
	headerString: string;
}

export function FormErrorModal({ isOpen, onOpenChange, popupBody, onClose, buttonString, headerString }: PopupProps) {
	return (
		<Modal
			isOpen={isOpen}
			placement='center'
			backdrop='blur'
			onOpenChange={(isOpen) => {
				onOpenChange(isOpen);
			}}
		>
			<ModalContent>
				<>
					<ModalHeader className='flex flex-col gap-1'>{headerString}</ModalHeader>
					<ModalBody>
						<p>{popupBody}</p>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' variant='light' onPress={onClose}>
							{buttonString}
						</Button>
					</ModalFooter>
				</>
			</ModalContent>
		</Modal>
	);
}
