import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/global/shadcn/carousel';
import { Image } from '@heroui/react';
import Autoplay from 'embla-carousel-autoplay';

const listItems = ['/images/Banner.png', '/images/Banner1.png'];

function Banner() {
	return (
		<div className='w-full px-4 md:px-8 lg:px-12r'>
			<Carousel
				className='relative w-full'
				plugins={[
					Autoplay({
						delay: 8000,
					}),
				]}
			>
				<CarouselContent>
					{listItems.map((item) => (
						<CarouselItem key={item}>
							<Image
								src={item}
								alt={`Banner ${item}`}
								className='w-[95vw] h-[30vh] md:h-[45vh] lg:h-[50vh] '
								radius='md'
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				<div className='absolute inset-y-0 left-[-2rem] right-[-2rem] flex items-center justify-between pointer-events-none'>
					<div className='pointer-events-auto'>
						<CarouselPrevious className='relative left-4' />
					</div>
					<div className='pointer-events-auto'>
						<CarouselNext className='relative right-4' />
					</div>
				</div>
			</Carousel>
		</div>
	);
}

export default Banner;
