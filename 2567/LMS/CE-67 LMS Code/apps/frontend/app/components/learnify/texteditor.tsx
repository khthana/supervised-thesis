import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { type Descendant, Editor, Element as SlateElement, Transforms, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, type RenderElementProps, type RenderLeafProps, Slate, useSlate, withReact } from 'slate-react';
import { Button, Icon, Toolbar } from './Toolbar';
import type {
	CustomEditor,
	CustomElement,
	CustomElementType,
	CustomElementWithAlign,
	CustomTextKey,
} from './custom-types.d';

const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const;
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const;

type AlignType = (typeof TEXT_ALIGN_TYPES)[number];
type ListType = (typeof LIST_TYPES)[number];
type CustomElementFormat = CustomElementType | AlignType | ListType;

// Default empty editor value
const EMPTY_VALUE: Descendant[] = [
	{
		type: 'paragraph',
		children: [{ text: '' }],
	} as Descendant,
];

interface RichProps {
	onChange?: (value: Descendant[]) => void;
	value?: Descendant[] | string | null; // Allow string or null
	placeholder?: string;
	// Additional props to accept from form components
	id?: string;
	className?: string;
	isInvalid?: boolean;
	errorMessage?: string;
	onBlur?: () => void;
	disabled?: boolean;
	name?: string;
	ref?: React.Ref<HTMLDivElement>;

	// Dimension props
	height?: string;
	minHeight?: string;
	maxHeight?: string;
	width?: string;
	minWidth?: string;
	maxWidth?: string;
}

const RichTextEditor = ({
	onChange,
	value,
	placeholder,
	id,
	className,
	// Additional props below are simply received but not used directly in render
	isInvalid,
	errorMessage,
	onBlur,
	disabled,
	name,
	ref,

	// Dimension props
	height = 'auto',
	minHeight = '150px',
	maxHeight = 'none',
	width = '100%',
	minWidth = 'none',
	maxWidth = 'none',

	...otherProps
}: RichProps) => {
	const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
	const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);

	// Parse and set initial value
	const initialValue = useMemo(() => {
		if (!value) return EMPTY_VALUE;

		if (typeof value === 'string') {
			try {
				// Try to parse as JSON
				return JSON.parse(value) as Descendant[];
			} catch (error) {
				console.error('Error parsing editor content:', error);
				// If parsing fails, create a simple paragraph with the string value
				return [
					{
						type: 'paragraph',
						children: [{ text: value }],
					} as Descendant,
				];
			}
		}

		// If it's already an array, use it directly
		return Array.isArray(value) ? value : EMPTY_VALUE;
	}, [value]);

	const handleChange = (newValue: Descendant[]) => {
		const isAstChange = editor.operations.some((op) => 'set_selection' !== op.type);
		if (isAstChange && onChange) {
			onChange(newValue);
		}
	};

	const handleBlur = () => {
		if (onBlur) {
			onBlur();
		}
	};

	// Style for the editor container
	const containerStyle: React.CSSProperties = {
		width,
		minWidth,
		maxWidth,
	};

	// Style for the editable area
	const editableStyle: React.CSSProperties = {
		height,
		minHeight,
		maxHeight,
		padding: '10px',
		overflow: 'auto',
		border: isInvalid ? '1px solid red' : '1px solid #ddd',
		borderRadius: '4px',
	};

	return (
		<div id={id} className={className} style={containerStyle} ref={ref}>
			<Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
				<Toolbar>
					<MarkButton format='bold' icon='format_bold' />
					<MarkButton format='italic' icon='format_italic' />
					<MarkButton format='underline' icon='format_underlined' />
					<MarkButton format='code' icon='code' />
					<BlockButton format='block-quote' icon='format_quote' />
					{/* <BlockButton format="numbered-list" icon="format_list_numbered" />
					<BlockButton format="bulleted-list" icon="format_list_bulleted" /> */}
					<BlockButton format='left' icon='format_align_left' />
					<BlockButton format='center' icon='format_align_center' />
					<BlockButton format='right' icon='format_align_right' />
					<BlockButton format='justify' icon='format_align_justify' />
				</Toolbar>

				<div style={editableStyle}>
					<Editable
						renderElement={renderElement}
						renderLeaf={renderLeaf}
						placeholder={placeholder || 'Enter some rich text…'}
						spellCheck
						disabled={disabled}
						onBlur={handleBlur}
					/>
				</div>

				{isInvalid && errorMessage && <div className='text-red-500 text-sm mt-1'>{errorMessage}</div>}
			</Slate>
		</div>
	);
};

// Rest of the original code remains the same
const toggleBlock = (editor: CustomEditor, format: CustomElementFormat) => {
	const isActive = isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type');
	const isList = isListType(format);

	Transforms.unwrapNodes(editor, {
		match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && isListType(n.type) && !isAlignType(format),
		split: true,
	});
	let newProperties: Partial<SlateElement>;
	if (isAlignType(format)) {
		newProperties = {
			align: isActive ? undefined : format,
		};
	} else {
		newProperties = {
			type: isActive ? 'paragraph' : isList ? 'list-item' : format,
		};
	}
	Transforms.setNodes<SlateElement>(editor, newProperties);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

const toggleMark = (editor: CustomEditor, format: CustomTextKey) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor: CustomEditor, format: CustomElementFormat, blockType: 'type' | 'align' = 'type') => {
	const { selection } = editor;
	if (!selection) return false;

	const [match] = Array.from(
		Editor.nodes(editor, {
			at: Editor.unhangRange(editor, selection),
			match: (n) => {
				if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
					if (blockType === 'align' && isAlignElement(n)) {
						return n.align === format;
					}
					return n.type === format;
				}
				return false;
			},
		}),
	);

	return !!match;
};

const isMarkActive = (editor: CustomEditor, format: CustomTextKey) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }: RenderElementProps) => {
	const style: React.CSSProperties = {};
	if (isAlignElement(element)) {
		style.textAlign = element.align as AlignType;
	}
	switch (element.type) {
		case 'block-quote':
			return (
				<blockquote style={style} {...attributes}>
					{children}
				</blockquote>
			);
		case 'bulleted-list':
			return (
				<ul style={style} {...attributes}>
					{children}
				</ul>
			);
		case 'heading-one':
			return (
				<h1 style={style} {...attributes}>
					{children}
				</h1>
			);
		case 'heading-two':
			return (
				<h2 style={style} {...attributes}>
					{children}
				</h2>
			);
		case 'list-item':
			return (
				<li style={style} {...attributes}>
					{children}
				</li>
			);
		case 'numbered-list':
			return (
				<ol style={style} {...attributes}>
					{children}
				</ol>
			);
		default:
			return (
				<p style={style} {...attributes}>
					{children}
				</p>
			);
	}
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>;
	}

	if (leaf.code) {
		children = <code>{children}</code>;
	}

	if (leaf.italic) {
		children = <em>{children}</em>;
	}

	if (leaf.underline) {
		children = <u>{children}</u>;
	}

	return <span {...attributes}>{children}</span>;
};

interface BlockButtonProps {
	format: CustomElementFormat;
	icon: string;
}

const BlockButton = ({ format, icon }: BlockButtonProps) => {
	const editor = useSlate();
	return (
		<Button
			active={isBlockActive(editor, format, isAlignType(format) ? 'align' : 'type')}
			onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}
		>
			<span className='material-symbols-outlined'>{icon}</span>
		</Button>
	);
};

interface MarkButtonProps {
	format: CustomTextKey;
	icon: string;
}

const MarkButton = ({ format, icon }: MarkButtonProps) => {
	const editor = useSlate();
	return (
		<Button
			active={isMarkActive(editor, format)}
			onMouseDown={(event: MouseEvent<HTMLSpanElement>) => {
				event.preventDefault();
				toggleMark(editor, format);
			}}
		>
			<span className='material-symbols-outlined'>{icon}</span>
		</Button>
	);
};

const isAlignType = (format: CustomElementFormat): format is AlignType => {
	return TEXT_ALIGN_TYPES.includes(format as AlignType);
};

const isListType = (format: CustomElementFormat): format is ListType => {
	return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (element: CustomElement): element is CustomElementWithAlign => {
	return 'align' in element;
};

export default RichTextEditor;
