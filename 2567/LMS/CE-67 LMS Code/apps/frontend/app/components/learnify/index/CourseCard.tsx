import type { ParentLoaderData } from '@/routes/_lnf';
import { Card, CardBody, Chip, Image, Tooltip } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';
import { replace, useNavigate } from 'react-router';
import { useOutletContext } from 'react-router';
import MaterialSymbol from '../../global/Icons/MaterialSymbol';

interface CardProp {
	Course_name: string;
	Url_img: string | undefined;
	Cat: string;
	Course_id: string;
}

function CardPublic({ Course_name, Cat, Course_id, Url_img }: CardProp) {
	/***
	 *
	 * @param Course_name ชื่อคอร์ส
	 * @param Url_img รูปภาพ
	 * @param Cat หมวดหมู่หลัก
	 *
	 */

	const [isFavorite, setIsFavorite] = useState(false);
	const [isLoaded, setIsLoaded] = useState(true);
	const [hasError, setHasError] = useState(false);
	const imageRef = useRef<HTMLImageElement>(null);
	const navigate = useNavigate();

	const { loaderData } = useOutletContext<{ loaderData: ParentLoaderData }>();
	const userId = loaderData.user?.user_id;

	const bookmarkKey = `bookmarkedCourses_${userId}`;

	useEffect(() => {
		const bookmarks = JSON.parse(localStorage.getItem(bookmarkKey) || '[]');
		setIsFavorite(bookmarks.includes(Course_name));
	}, [Course_name, bookmarkKey]);

	useEffect(() => {
		if (imageRef.current?.complete) {
			setIsLoaded(true);
		}
	}, []);

	const handleFavorite = (e: React.MouseEvent | React.KeyboardEvent) => {
		e.stopPropagation();
		const bookmarks = JSON.parse(localStorage.getItem(bookmarkKey) || '[]');

		if (!userId) {
			navigate('/login');
			return;
		}

		if (isFavorite) {
			const newBookmarks = bookmarks.filter((name: string) => name !== Course_name);
			localStorage.setItem(bookmarkKey, JSON.stringify(newBookmarks));
		} else {
			bookmarks.push(Course_name);
			localStorage.setItem(bookmarkKey, JSON.stringify(bookmarks));
		}

		setIsFavorite(!isFavorite);
	};

	const handleLoad = () => {
		setIsLoaded(true);
	};

	const gotoDetail = () => {
		replace(`/courses/${Course_id}`);
		navigate(`/courses/${Course_id}`, { replace: true });
	};

	const handleCourseName = (name: string) => {
		if (name.length > 20) {
			return `${name.slice(0, 26)}...`;
		}
		return name;
	};

	const handleError = () => {
		setHasError(true);
		setIsLoaded(true);
	};

	return (
		<div className='w-fit flex items-center '>
			<div
				className='w-fit h-fit '
				onClick={gotoDetail}
				onKeyDown={(e) => {
					if (e.key === 'Enter') gotoDetail();
				}}
			>
				<Card
					// w, h = responsive
					className='CardPublic border-[2px] border-solid rounded-xl
								min-w-[100px] max-w-[285px] min-h-[365px] max-h-[365px]
								transition ease-in-out hover:-translate-y-1 hover:scale-100 duration-300'
				>
					<div
						className='w-fit absolute z-20 self-end cursor-pointer select-none rounded-full'
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleFavorite(e as unknown as React.MouseEvent);
						}}
						onClick={handleFavorite}
					>
						<MaterialSymbol name='bookmark' size={48} color={isFavorite ? '#006FEE' : '#a8a8a8'} fill={1} />
					</div>

					<div className='flex px-2 pt-2'>
						{/* <Skeleton className='rounded-lg h-[255px] w-[455px]' isLoaded={false}> */}
						<Image
							ref={imageRef}
							loading='lazy'
							src={Url_img}
							// fallbackSrc='https://images.icon-icons.com/859/PNG/512/worst_icon-icons.com_67793.png'
							alt='Card example background'
							// className=' h-full w-full position-center'
							width={265}
							height={265}
							onLoad={handleLoad}
							// onError={handleError}
							className='w-full h-full object-cover object-center'
						/>
						{/* </Skeleton> */}
					</div>

					<CardBody className='w-full overflow-hidden'>
						{/* <Skeleton className='rounded-lg' isLoaded={isLoaded}> */}
						<Tooltip content={Course_name}>
							<p className='w-full'>{handleCourseName(Course_name)}</p>
						</Tooltip>
						{/* </Skeleton> */}
						{/* <Skeleton className='mt-1 rounded-lg w-fit' isLoaded={isLoaded}> */}
						<Chip variant='bordered' size='md'>
							{Cat}
						</Chip>
						{/* </Skeleton> */}
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

export default CardPublic;
