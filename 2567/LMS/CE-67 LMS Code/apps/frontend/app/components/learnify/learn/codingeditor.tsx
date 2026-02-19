import type { Subtopic } from '@/interfaces/sharetype';
import { Autocomplete, AutocompleteItem, Button, Card, CardBody, Tab, Tabs } from '@heroui/react';
import Editor from '@monaco-editor/react';
import { useEffect, useState } from 'react';

interface CodingEditorProps {
	quizContent: string;
	isReadOnly?: boolean;
}

const CodingEditor = ({ quizContent, isReadOnly = false }: CodingEditorProps) => {
	const [activeTab, setActiveTab] = useState<'instruction' | 'ide'>('instruction');
	const [code, setCode] = useState('# เขียนโค้ดของคุณที่นี่');
	const [output, setOutput] = useState('> Current output will appear here');
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState('python');

	const languages = [
		{ key: 'python', label: 'Python', defaultCode: '# เขียนโค้ดของคุณที่นี่' },
		{
			key: 'java',
			label: 'Java',
			defaultCode: 'class Main {\n    public static void main(String[] args) {\n        // เขียนโค้ดของคุณที่นี่\n    }\n}',
		},
		{
			key: 'javascript',
			label: 'JavaScript',
			defaultCode: '// เขียนโค้ดของคุณที่นี่',
		},
	];

	useEffect(() => {
		try {
			const parsedQuizData = JSON.parse(quizContent);
			setCode(parsedQuizData.code || languages.find((lang) => lang.key === selectedLanguage)?.defaultCode || '');
		} catch {
			console.error('Failed to parse quiz content');
			setCode(languages.find((lang) => lang.key === selectedLanguage)?.defaultCode || '');
		}
	}, [quizContent, selectedLanguage]);

	const handleSubmit = () => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
			setIsSubmitted(true);
			setOutput('> Your code has been submitted successfully!');
		}, 2000);
	};

	const handleEditorChange = (value: string | undefined) => {
		if (!isReadOnly) {
			setCode(value || '');
			setIsSubmitted(false);
			setOutput('> Current output will appear here');
		}
	};

	const handleLanguageChange = (key: string) => {
		setSelectedLanguage(key);
		const newDefaultCode = languages.find((lang) => lang.key === key)?.defaultCode || '';
		setCode(newDefaultCode);
		setIsSubmitted(false);
		setOutput('> Current output will appear here');
	};

	const renderInstructions = () => {
		try {
			const parsedContent = JSON.parse(quizContent);
			return (
				<Card>
					<CardBody className='p-6'>
						<p className='whitespace-pre-wrap'>{parsedContent.instructions || quizContent}</p>
					</CardBody>
				</Card>
			);
		} catch (error) {
			return (
				<Card>
					<CardBody className='p-6'>
						<p className='whitespace-pre-wrap'>{quizContent}</p>
					</CardBody>
				</Card>
			);
		}
	};

	const renderIde = () => (
		<div>
			<Editor
				height='300px'
				language={selectedLanguage}
				value={code}
				onChange={handleEditorChange}
				theme='vs-dark'
				options={{
					minimap: { enabled: false },
					fontSize: 14,
					readOnly: isReadOnly,
				}}
			/>
			<div className='mt-4'>
				<h2 className='text-xl font-bold mb-2'>Result</h2>
				<Card className='bg-gray-800'>
					<CardBody>
						<pre className='text-white font-mono whitespace-pre-wrap'>{output}</pre>
					</CardBody>
				</Card>
			</div>
		</div>
	);

	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-4'>
				<Tabs selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as 'instruction' | 'ide')}>
					<Tab key='instruction' title='Instructions' />
					<Tab key='ide' title='IDE' />
				</Tabs>

				<div className='flex items-center gap-2'>
					<Autocomplete
						isDisabled={isReadOnly}
						defaultSelectedKey='python'
						selectedKey={selectedLanguage}
						onSelectionChange={(key) => handleLanguageChange(key as string)}
						className='w-40'
						size='sm'
						defaultItems={languages}
					>
						{(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
					</Autocomplete>

					{!isReadOnly && (
						<Button color={isSubmitted ? 'success' : 'primary'} isLoading={isLoading} onPress={handleSubmit} size='sm'>
							{isSubmitted ? '✓ SUCCESS' : isLoading ? '⚡ PROCESSING' : '🚀 SUBMIT'}
						</Button>
					)}
				</div>
			</div>

			{activeTab === 'instruction' ? renderInstructions() : renderIde()}
		</div>
	);
};

export default CodingEditor;
