import { Card, CardBody, Progress } from '@heroui/react';

const Progressbar = () => {
	return (
		<Card className='w-full max-w-md mx-auto'>
			<CardBody className='p-4'>
				<h4 className='text-lg font-bold mb-2'>Progress</h4>
				<div className='flex justify-between mb-1'>
					<span className='text-sm'>Programing Funametal</span>
					<span className='text-sm font-semibold'>50%</span>
				</div>
				<Progress aria-label='Course progress' value={50} className='max-w-full' />
			</CardBody>
		</Card>
	);
};

export default Progressbar;
