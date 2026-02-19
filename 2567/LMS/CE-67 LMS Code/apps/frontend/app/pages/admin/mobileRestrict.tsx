import MaterialSymbol from '@/components/global/Icons/MaterialSymbol';

export default function MobileRestrict() {
	return (
		<div className='flex flex-col items-center justify-center h-screen'>
			<h1 className='text-3xl font-bold flex items-center'>
				<MaterialSymbol name='screenshot_tablet' fill={1} weight={700} grade={0} opticalSize={48} size='5rem' />
				<span className='ml-4'>Restricted</span>
			</h1>
			<p className='text-xl mt-4'>This page is only available on larger devices.</p>
		</div>
	);
}
