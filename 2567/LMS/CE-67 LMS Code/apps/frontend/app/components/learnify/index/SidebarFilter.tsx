import type { CategoriesWithSubcategories } from '@/interfaces/sharetype';
import { Button, Card, CardBody, CardFooter, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@heroui/react';
import type { CourseSubCategory } from '@shared/types/courses/course.model';
import { useEffect, useState } from 'react';

interface FilterbarProps {
	categories: CategoriesWithSubcategories;
	onApplyFilter: (categoryId: string | null, subCategoryIds: string[]) => void;
}

export default function Filterbar({ categories, onApplyFilter }: FilterbarProps) {
	const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
	const [filteredSubcategories, setFilteredSubcategories] = useState<CourseSubCategory[]>([]);
	const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);

	const handleMainCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedMainCategory(event.target.value);
		setSelectedSubCategories([]); // รีเซ็ต subcategory ที่เลือกเมื่อเปลี่ยน main category
	};

	const handleSubCategoryChange = (values: string[]) => {
		setSelectedSubCategories(values);
	};

	const handleApplyFilter = () => {
		onApplyFilter(selectedMainCategory, selectedSubCategories);
	};

	const handleClearFilter = () => {
		setSelectedMainCategory(null);
		setSelectedSubCategories([]);
		setFilteredSubcategories([]);
		onApplyFilter(null, []);
	};

	useEffect(() => {
		if (selectedMainCategory) {
			const selectedCategory = categories.find((cat) => cat.category_id.toString() === selectedMainCategory);
			if (selectedCategory) {
				setFilteredSubcategories(selectedCategory.course_subcategories);
			} else {
				setFilteredSubcategories([]);
			}
		} else {
			setFilteredSubcategories([]);
		}
	}, [selectedMainCategory, categories]);

	return (
		<div className=' max-w-[360px] min-w-[280px] overflow-x-hidden w-full pl-8 pt-5'>
			<Card className='w-fit p-5 pr-12 m-10 lg:w-full lg:m-0 lg:pr-0 md:mr-5 md:pr-0 max-h-[550px]'>
				<CardBody>
					<h4 className='pb-3 text-xl font-bold'>Category</h4>
					<RadioGroup className='ml-4' onChange={handleMainCategoryChange} value={selectedMainCategory || ''}>
						{categories.map((cat) => (
							<Radio key={cat.category_id} value={cat.category_id.toString()} className='py-2'>
								{cat.name}
							</Radio>
						))}
					</RadioGroup>

					{selectedMainCategory && filteredSubcategories.length > 0 && (
						<div>
							<h4 className='pb-2 pt-6 text-xl font-bold'>Sub Category</h4>
							<CheckboxGroup className='ml-4' value={selectedSubCategories} onChange={handleSubCategoryChange}>
								{filteredSubcategories.map((sub) => (
									<Checkbox key={sub.subcategory_id} value={sub.subcategory_id.toString()} className='py-2'>
										{sub.name}
									</Checkbox>
								))}
							</CheckboxGroup>
						</div>
					)}
				</CardBody>
				<CardFooter>
					<Button onPress={handleApplyFilter} color='primary'>
						Apply
					</Button>
					<Button onPress={handleClearFilter} variant='light' color='danger'>
						Clear
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
