// QuizSettings.jsx
import { Button, Card, CardBody, Switch } from '@heroui/react';

interface Settings {
	randomizeQuestions: boolean;
	randomizeOptions: boolean;
	showScoreImmediately: boolean;
	showIncorrectAnswers: boolean;
	onChange: (key: string, value: boolean) => void;
	onSave: () => void;
}

const QuizSettings = ({ settings }: { settings: Settings }) => {
	return (
		<Card>
			<CardBody className='p-6'>
				<div className='space-y-6'>
					<div className='flex justify-between items-center'>
						<div>
							<p className='text-base font-medium'>Randomize Questions</p>
							<p className='text-sm text-gray-500'>Shuffle the order of questions for each student</p>
						</div>
						<Switch
							isSelected={settings?.randomizeQuestions}
							onValueChange={(value) => settings?.onChange('randomizeQuestions', value)}
						/>
					</div>

					<div className='flex justify-between items-center'>
						<div>
							<p className='text-base font-medium'>Randomize Options</p>
							<p className='text-sm text-gray-500'>Shuffle the order of answer options in each question</p>
						</div>
						<Switch
							isSelected={settings?.randomizeOptions}
							onValueChange={(value) => settings?.onChange('randomizeOptions', value)}
						/>
					</div>

					<div className='flex justify-between items-center'>
						<div>
							<p className='text-base font-medium'>Show Score Immediately</p>
							<p className='text-sm text-gray-500'>Display the score right after submission</p>
						</div>
						<Switch
							isSelected={settings?.showScoreImmediately}
							onValueChange={(value) => settings?.onChange('showScoreImmediately', value)}
						/>
					</div>

					<div className='flex justify-between items-center'>
						<div>
							<p className='text-base font-medium'>Show Incorrect Answers</p>
							<p className='text-sm text-gray-500'>Display which questions were answered incorrectly</p>
						</div>
						<Switch
							isSelected={settings?.showIncorrectAnswers}
							onValueChange={(value) => settings?.onChange('showIncorrectAnswers', value)}
							isDisabled={!settings?.showScoreImmediately}
						/>
					</div>

					<Button color='primary' className='w-full mt-6' onPress={settings?.onSave}>
						Save Settings
					</Button>
				</div>
			</CardBody>
		</Card>
	);
};

export default QuizSettings;
