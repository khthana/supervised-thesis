// import { LanguageSelector } from '@/components/global/language/LanguageSelector';
import { Link } from 'react-router';

interface FooterProps {
	companyName: string;
	year: number;
}

export function Footer({ companyName, year }: FooterProps) {
	return (
		<footer className='py-6'>
			<div className='container mx-auto px-4'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<div>
						<h3 className='font-bold mb-2'>ที่อยู่</h3>
						<p className='text-sm'>
							อาคารปฏิบัติการรวมวิศวกรรมศาสตร์ 2 (ECC)
							<br />
							เลขที่ 1 ซอยฉลองกรุง 1 แขวงลาดกระบัง
							<br />
							เขตลาดกระบัง กรุงเทพมหานคร 10520
						</p>
					</div>
					<div>
						<h3 className='font-bold mb-2'>ลิงก์ที่เกี่ยวข้อง</h3>
						<ul className='text-sm space-y-1'>
							<li>
								<Link to='/' className='hover:underline'>
									หน้าหลัก
								</Link>
							</li>
							<li>
								<a href='https://www.kmitl.ac.th' target='_blank' rel='noopener noreferrer' className='hover:underline'>
									เว็บสถาบันฯ
								</a>
							</li>
							<li>
								<a
									href='https://www.eng.kmitl.ac.th'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline'
								>
									เว็บคณะวิศวกรรมศาสตร์
								</a>
							</li>
							<li>
								<a
									href='https://www.reg.kmitl.ac.th'
									target='_blank'
									rel='noopener noreferrer'
									className='hover:underline'
								>
									เว็บสำนักทะเบียน
								</a>
							</li>
						</ul>
					</div>
					<div className='flex flex-col items-start'>
						<div className='mb-4'>
							<a
								href='https://www.facebook.com/KMITL'
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:underline'
							>
								Facebook: CE-KMITL
							</a>
						</div>
						<div className='hidden sm:block'>{/* <LanguageSelector /> */}</div>
					</div>
				</div>
				<div className='mt-6 pt-4 border-t border-gray-300 text-center text-sm'>
					<p>
						&copy; {year} {companyName}. สงวนลิขสิทธิ์.
					</p>
				</div>
			</div>
		</footer>
	);
}
