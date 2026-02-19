import type { CategoriesWithSubcategories } from '@/interfaces/sharetype';
import { Button, Checkbox, CheckboxGroup, Radio, RadioGroup } from '@heroui/react';
import type { CourseSubCategory } from '@shared/types/courses/course.model';
import { useEffect, useState } from 'react';

interface FilterModalProps {
	categories: CategoriesWithSubcategories;
	onApplyFilter: (categoryId: string | null, subCategoryIds: string[]) => void;
}

function FilterModal({ categories, onApplyFilter }: FilterModalProps) {
	const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
	const [filteredSubcategories, setFilteredSubcategories] = useState<CourseSubCategory[]>([]);
	const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([]);
	const [selectedLanguage, setSelectedLanguage] = useState<string[]>([]);

	const handleMainCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedMainCategory(event.target.value);
		setSelectedSubCategories([]); // รีเซ็ต subcategory เมื่อเปลี่ยน category
	};

	const handleSubCategoryChange = (values: string[]) => {
		setSelectedSubCategories(values);
	};

	const handleLanguageChange = (values: string[]) => {
		setSelectedLanguage(values);
	};

	const handleApply = () => {
		onApplyFilter(selectedMainCategory, selectedSubCategories);
	};

	const handleClearFilter = () => {
		setSelectedMainCategory(null);
		setSelectedSubCategories([]);
		setFilteredSubcategories([]);
		setSelectedLanguage([]);
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
		<div className='w-fit p-5 pr-12 m-10 lg:w-full lg:m-0 lg:pr-0 md:mr-5 md:pr-0 max-h-[550px]'>
			<div>
				<h4 className='pb-3 text-xl text-bold'>Category</h4>
				<RadioGroup onChange={handleMainCategoryChange} value={selectedMainCategory || ''}>
					{categories.map((cat) => (
						<Radio key={cat.category_id} value={cat.category_id.toString()} className='py-2'>
							{cat.name}
						</Radio>
					))}
				</RadioGroup>

				{selectedMainCategory && filteredSubcategories.length > 0 && (
					<div>
						<h4 className='pb-2 pt-6 text-xl text-bold'>Sub Category</h4>
						<CheckboxGroup value={selectedSubCategories} onChange={handleSubCategoryChange}>
							{filteredSubcategories.map((sub) => (
								<Checkbox key={sub.subcategory_id} value={sub.subcategory_id.toString()} className='py-2'>
									{sub.name}
								</Checkbox>
							))}
						</CheckboxGroup>
					</div>
				)}

				<div>
					<h4 className='pb-2 pt-6 text-xl text-bold'>Languages</h4>
					<CheckboxGroup value={selectedLanguage} onChange={handleLanguageChange}>
						<Checkbox className='py-2' value='english'>
							English
						</Checkbox>
						<Checkbox className='py-2' value='thai'>
							Thai
						</Checkbox>
					</CheckboxGroup>
				</div>
			</div>
			<div className='mt-4 flex justify-between'>
				<Button onPress={handleClearFilter} variant='light' color='danger'>
					Clear
				</Button>
				<Button onPress={handleApply} color='primary'>
					Apply
				</Button>
			</div>
		</div>
	);
}

export default FilterModal;
