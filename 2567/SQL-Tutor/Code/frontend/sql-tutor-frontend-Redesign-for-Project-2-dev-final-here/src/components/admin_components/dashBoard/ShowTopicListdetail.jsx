'use client';

import {
  Accordion,
  AccordionItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ScrollShadow,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { updatestatus, GettopicProgress } from './service/useDashboard';

export default function ShowTopicListDetail() {
  const [isOpen, setIsOpen] = useState({});
  const [dropDownStatus, setDropDownStatus] = useState({});
  const [activeKey, setActiveKey] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await GettopicProgress();
      setTopics(fetchedTopics);
    };

    fetchTopics();
  }, [dropDownStatus]);

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
  // Example of main topics array structure

  const toggleDropdown = (topicId) => {
    setIsOpen((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const toggleStatus = async (topicId, topicName, status, state) => {
    try {
      await updatestatus(topicId, topicName, status);
      setDropDownStatus((prev) => ({
        ...prev,
        [topicId]: state,
      }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

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

  const handleSelectionChange = (key) => {
    setActiveKey(key);
  };

  const getStatusText = (status) => {
    return status === 1 ? 'Open' : 'Close';
  };
  return (
    <div>
      <div className='PaddingXSet'>
        <div className='rg:pr-20 flex w-full flex-row border-b-1 border-gray-200 py-2 text-sm font-light text-gray-400 sm:pr-10 md:pr-20'>
          <p className='w-4/12 text-inherit'>Main topic name</p>
          <p className='w-1/12 text-center text-inherit'>Subtopic</p>
          <p className='w-1/12 text-center text-inherit'>Lesson</p>
          <p className='w-1/12 text-center text-inherit'>Exercise</p>
          <p className='w-1/12 text-center text-inherit'>Exam test</p>
          <p className='w-2/12 text-center text-inherit'>Finish</p>
          <p className='w-2/12 text-center text-inherit'>Status</p>
        </div>
      </div>

      <ScrollShadow
        hideScrollBar
        orientation='vertical'
        className='flex max-h-[80vh] w-full flex-row sm:px-8 md:px-16 lg:px-16'
      >
        <Accordion
          className='w-full'
          selectedKeys={activeKey ? [activeKey] : []}
          onSelectionChange={(keys) =>
            handleSelectionChange(Array.from(keys)[0])
          }
        >
          {topics?.map((topic) => (
            <AccordionItem
              key={topic.M_topic_id}
              className='w-full'
              aria-label={topic.M_topic_title}
              title={
                <div
                  className={`flex w-full flex-row items-center px-2 py-2 transition-colors duration-200 ${
                    activeKey === topic.M_topic_id
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className='w-4/12 text-inherit sm:font-light md:font-normal'>
                    {topic.M_topic_title}
                  </p>
                  <p className='w-1/12 text-center text-inherit'>
                    {topic.SubTopics.length}
                  </p>
                  <p className='w-1/12 text-center text-inherit'>
                    {topic.SubTopics.filter((sub) => sub.Type === 'L').length}
                  </p>
                  <p className='w-1/12 text-center text-inherit'>
                    {topic.SubTopics.filter((sub) => sub.Type === 'EX').length}
                  </p>
                  <p className='w-1/12 text-center text-inherit'>
                    {topic.SubTopics.filter((sub) => sub.Type === 'ET').length}
                  </p>
                  <p className='w-2/12 text-center text-inherit'>
                    {topic.userPassedCount}
                  </p>
                  <div className='flex w-2/12 justify-center'>
                    <Dropdown isDisabled={topic.SubTopics.length === 0}>
                      <DropdownTrigger>
                        <div // Changed from Button to div
                          className={`flex min-w-[100px] cursor-pointer items-center justify-between rounded-2xl px-5 py-2 ${
                            topic.status === 1 ? 'bg-green-100' : 'bg-red-100'
                          }`}
                          role='button'
                          tabIndex={0}
                          onClick={() => toggleDropdown(topic.M_topic_id)}
                        >
                          <span>{getStatusText(topic.status)}</span>
                          <ChevronIcon
                            className={
                              isOpen[topic.M_topic_id]
                                ? 'rotate-180'
                                : 'rotate-0'
                            }
                          />
                        </div>
                      </DropdownTrigger>
                      <DropdownMenu aria-label='Status Actions'>
                        <DropdownItem
                          key='Open'
                          className='text-green-600'
                          onPress={() =>
                            toggleStatus(
                              topic.M_topic_id,
                              topic.M_topic_title,
                              1
                            )
                          }
                        >
                          Open
                        </DropdownItem>
                        <DropdownItem
                          key='Close'
                          className='text-red-600'
                          onPress={() =>
                            toggleStatus(
                              topic.M_topic_id,
                              topic.M_topic_title,
                              0
                            )
                          }
                        >
                          Close
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              }
              hideIndicator={true}
            >
              {/* Rest of your AccordionItem content */}
              <div className='w-full'>
                <div className='flex w-full flex-row text-sm font-light text-gray-400'>
                  <p className='w-1/12 text-inherit'></p>
                  <p className='w-3/12 text-inherit'>Subtopic name</p>
                  <p className='w-1/12 text-center text-inherit'>Finish</p>
                </div>
                {topic.SubTopics.sort((a, b) => a.Order - b.Order)?.map(
                  (subtopic, index) => (
                    <div
                      key={index}
                      className='flex w-full items-center py-4 hover:bg-gray-50'
                    >
                      <div className='flex w-full flex-row items-center'>
                        <span className='flex w-1/12 justify-end pr-5'>
                          <div>{getIcon(subtopic.Type)}</div>
                        </span>
                        <span className='w-3/12 text-sm'>
                          {subtopic.S_topic_title}
                        </span>
                        <span className='w-1/12 text-center'>
                          {subtopic.userPassedCount}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollShadow>
    </div>
  );
}
