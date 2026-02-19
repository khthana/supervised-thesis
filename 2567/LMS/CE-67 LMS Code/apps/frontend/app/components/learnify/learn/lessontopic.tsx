import { useState } from 'react';

function Lessontopic() {
	const [isVisible, setIsVisible] = useState(false);

	// ฟังก์ชันสำหรับการสลับสถานะเปิด/ปิด div
	const toggleDiv = () => {
		setIsVisible(!isVisible);
	};

	return (
		<div className='topic w-full mb-2'>
			<div
				className='head-accorder-learning w-full rounded-md h-fit py-3 px-2 text-lg font-semibold drop-shadow hover:bg-blue-700 hover:text-gray-200 cursor-pointer'
				onClick={toggleDiv}
				onKeyUp={(e) => {
					if (e.key === 'Enter') toggleDiv();
				}}
			>
				Topic
			</div>
			{isVisible && (
				<div className='subtopic     px-5 py-2'>
					<div className='sub-accorder-learing w-full rounded-md h-fit mt-2 py-2 px-2 text-m font-normal drop-shadow cursor-pointer'>
						sub1
					</div>
					<div className='sub-accorder-learing w-full rounded-md h-fit mt-2 py-2 px-2 text-m font-normal drop-shadow cursor-pointer'>
						sub2
					</div>
				</div>
			)}
		</div>
	);
}

export default Lessontopic;
