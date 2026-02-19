export default function MobileWarning() {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
      <div className='rounded-lg p-6 text-center shadow-lg'>
        <h2 className='mb-4 text-xl font-bold text-red-600'>Desktop Only</h2>
        <p className='text-white'>
          This website is only available for desktop computers. Please switch to
          a PC or laptop for access.
        </p>
      </div>
    </div>
  );
}
