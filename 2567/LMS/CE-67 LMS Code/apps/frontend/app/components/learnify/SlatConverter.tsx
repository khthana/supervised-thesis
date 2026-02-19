import React from 'react';
import type { Descendant } from 'slate';
import type { CustomElement, CustomElementWithAlign, CustomText } from './custom-types.d';

interface SlateContentViewerProps {
	value: Descendant[] | string;
	className?: string;
}

const isAlignElement = (element: Descendant): element is CustomElementWithAlign => {
	return 'align' in element;
};

// Renders the Slate content as HTML with proper formatting
const SlateContentViewer: React.FC<SlateContentViewerProps> = ({ value, className }) => {
	let content: Descendant[];

	// Parse the content if it's a string
	if (typeof value === 'string') {
		try {
			content = JSON.parse(value) as Descendant[];
		} catch (error) {
			console.error('Error parsing Slate content:', error);
			return <div className={className}>Error parsing content</div>;
		}
	} else {
		content = value;
	}

	// Recursively render the Slate nodes
	const renderNode = (node: Descendant, index: number): React.ReactNode => {
		// Handle text nodes
		if ('text' in node) {
			const textNode = node as CustomText;
			const textContent = textNode.text;

			// Apply text formatting in the correct order
			let formattedContent = <>{textContent}</>;

			if (textNode.bold) {
				formattedContent = <strong>{formattedContent}</strong>;
			}

			if (textNode.italic) {
				formattedContent = <em>{formattedContent}</em>;
			}

			if (textNode.underline) {
				formattedContent = <u>{formattedContent}</u>;
			}

			if (textNode.code) {
				formattedContent = <code>{formattedContent}</code>;
			}

			if (textNode.strikethrough) {
				formattedContent = <s>{formattedContent}</s>;
			}

			return <React.Fragment key={index}>{formattedContent}</React.Fragment>;
		}

		// Handle element nodes
		const element = node as CustomElement;
		const children = <>{element.children.map((child, i) => renderNode(child, i))}</>;

		// Apply alignment if present
		const style: React.CSSProperties = {};
		if (isAlignElement(element) && element.align) {
			style.textAlign = element.align as React.CSSProperties['textAlign'];
		}

		// Apply element formatting based on type
		switch (element.type) {
			case 'paragraph':
				return (
					<p key={index} style={style} className='my-2'>
						{children}
					</p>
				);

			case 'block-quote':
				return (
					<blockquote key={index} style={style} className='pl-4 border-l-4 border-gray-300 italic my-4'>
						{children}
					</blockquote>
				);

			case 'heading-one':
				return (
					<h1 key={index} style={style} className='text-2xl font-bold my-3'>
						{children}
					</h1>
				);

			case 'heading-two':
				return (
					<h2 key={index} style={style} className='text-xl font-bold my-2'>
						{children}
					</h2>
				);

			case 'bulleted-list':
				return (
					<ul key={index} style={style} className='list-disc ml-6 my-3'>
						{children}
					</ul>
				);

			case 'numbered-list':
				return (
					<ol key={index} style={style} className='list-decimal ml-6 my-3'>
						{children}
					</ol>
				);

			case 'list-item':
				return (
					<li key={index} className='my-1'>
						{children}
					</li>
				);

			default:
				return (
					<div key={index} style={style}>
						{children}
					</div>
				);
		}
	};

	// If content is empty or invalid, show placeholder
	if (!content || !Array.isArray(content) || content.length === 0) {
		return <div className={className}>No content</div>;
	}

	return <div className={className}>{content.map((node, index) => renderNode(node, index))}</div>;
};

export default SlateContentViewer;
