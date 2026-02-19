'use client';

import React, { useState, useEffect } from 'react';
import { fetchTopics } from './service/courseService';
import { ScrollShadow } from '@heroui/react';

const ChevronIcon = ({ className = '' }) => (
  <svg
    className={`h-4 w-4 transition-transform duration-200 ${className}`}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M19 9l-7 7-7-7'
    />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
  >
    <path
      d='M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z'
      fill='#808080'
    />
  </svg>
);

const TopicItem = ({ topic, depth = 0.75, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (id) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'L':
        return (
          <div className='rounded-full bg-blue-100 p-1'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
              />
            </svg>
          </div>
        );
      case 'EX':
        return (
          <div className='rounded-full bg-purple-100 p-1'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
        );
      case 'ET':
        return (
          <div className='rounded-full bg-green-100 p-1'>
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full'>
      <div
        className={`flex items-center ${depth <= 0.75 ? 'border border-gray-200 p-4' : 'p-3 hover:bg-gray-100'}`}
        style={{ paddingLeft: `${depth * 20}px` }}
      >
        <div className='flex flex-1 items-center gap-3'>
          {depth == 0.75 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='rounded-full p-1 hover:bg-gray-200'
            >
              <ChevronIcon className={isExpanded ? 'rotate-180' : 'rotate-0'} />
            </button>
          )}
          {getIcon(topic.Type)}
          {depth > 0.75 ? (
            <span
              className={`${topic.Contents?.[0]?.state === 'lock' ? 'text-gray-400' : 'w-full cursor-pointer text-gray-500 hover:text-gray-700'}`}
              onClick={() =>
                topic.Contents?.[0]?.state !== 'lock' && handleSelect(topic)
              }
            >
              {topic.S_topic_title}
            </span>
          ) : (
            <span className='text-gray-700'>{topic.M_topic_title}</span>
          )}
        </div>
        {topic.Contents?.[0]?.state === 'lock' && <LockIcon />}
      </div>

      {isExpanded &&
        topic.SubTopics?.sort((a, b) => a.Order - b.Order).map(
          (subtopic, index) => (
            <TopicItem
              key={index}
              topic={subtopic}
              depth={depth + 1}
              onSelect={onSelect}
            />
          )
        )}
    </div>
  );
};

const TopicListUser = ({ handleSelect, updateProgress }) => {
  // console.log('updateProgress:', updateProgress);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchTopics();
      setTopics(data.data);
      // console.log('topics', data.data);
    };

    fetchData();
  }, [updateProgress]);

  return (
    <div className='w-full'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>My courses</h1>
      </div>

      <ScrollShadow
        hideScrollBar
        orientation='horizontal'
        className='flex h-[calc(100vh-150px)] flex-col'
      >
        {topics?.map((topic, index) => (
          <TopicItem key={index} topic={topic} onSelect={handleSelect} />
        ))}
      </ScrollShadow>
    </div>
  );
};

export default TopicListUser;
