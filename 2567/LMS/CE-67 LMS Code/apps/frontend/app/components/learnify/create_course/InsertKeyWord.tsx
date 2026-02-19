import { useGetTheme } from '@/hooks/useLearnifyHook';
import { Button, Chip, Input } from '@heroui/react';
import { useCallback, useState } from 'react';
import { ToastContainer, toast as notify } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaterialSymbol from '@/components/global/Icons/MaterialSymbol';

interface InsertKeyWordProps {
	onKeywordChange: (keywords: string[]) => void;
}

function InsertKeyWord({ onKeywordChange }: InsertKeyWordProps) {
	const [keywords, setKeywords] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState<string>('');
	const theme = useGetTheme();
	// const { toast } = useLoaderData<typeof loader>();

	const handleInsert = useCallback(() => {
		if (inputValue.trim()) {
			if (keywords.includes(inputValue.trim())) {
				notify.warning('Keyword already exists');
			} else {
				const newKeywords = [...keywords, inputValue.trim()];
				setKeywords(newKeywords);
				onKeywordChange(newKeywords);
				setInputValue('');
			}
		}
	}, [inputValue, keywords, onKeywordChange]);

	const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	}, []);

	const handleKeypress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleInsert();
		}
	};

	const handleDelete = useCallback(
		(keyword: string) => {
			const newKeywords = keywords.filter((kw) => kw !== keyword);
			setKeywords(newKeywords);
			onKeywordChange(newKeywords);
		},
		[keywords, onKeywordChange],
	);

	return (
		<div>
			<div className='flex'>
				<Input
					label='Keyword'
					className='max-w-52'
					placeholder=' '
					labelPlacement='outside'
					isRequired={true}
					value={inputValue}
					onChange={handleInputChange}
					onKeyPress={handleKeypress}
				/>
				<Button onPress={handleInsert} className='ml-5 mt-6 md:mt-6 lg:mt-7 xl:mt-6' color='primary'>
					Insert
				</Button>
			</div>

			<div className='flex flex-row gap-5 border border-solid max-w-128 max-h-20 my-5 rounded-lg p-5 overflow-auto'>
				{keywords.map((keyword) => (
					<Chip
						key={keyword}
						variant='bordered'
						color='default'
						className='mr-2'
						endContent={
							<Button
								isIconOnly
								className='w-[1px] h-fit'
								onPress={() => handleDelete(keyword)}
								color='danger'
								variant='light'
							>
								<MaterialSymbol name='close' size={10} />
							</Button>
						}
					>
						{keyword}
					</Chip>
				))}
			</div>
			<ToastContainer theme={theme} />
		</div>
	);
}

export default InsertKeyWord;
