'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  RadioGroup,
  Radio,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ScrollShadow,
} from '@heroui/react';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import {
  createMainTopic,
  getMainTopics,
  deleteMainTopic,
  deleteSubTopic,
  createSubTopic,
  renameMaintopic,
  renameSubtopic,
  updateSubtopicOrder,
} from './service/useLeftSiteBar';

// Add Alert component
const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 rounded-md px-4 py-3 shadow-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
    >
      <div className='flex items-center'>
        <div className='mr-3'>
          {type === 'error' ? (
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          ) : (
            <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          )}
        </div>
        <div>
          <p className='font-medium'>{message}</p>
        </div>
        <button onClick={onClose} className='ml-auto'>
          <svg className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
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

const TopicItem = ({
  topic,
  depth = 0.75,
  handleUpdate,
  onSelect,
  currentSubTopicId,
  showAlert,
}) => {
  const [topicType, setTopicType] = useState('');
  const [subTopicName, setSubTopicName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState(false);

  useEffect(() => {
    if (
      currentSubTopicId &&
      topic.SubTopics?.some((sub) => sub.S_topic_id === currentSubTopicId)
    ) {
      setIsExpanded(true);
    }
  }, [currentSubTopicId, topic.SubTopics]);

  const handleRename = () => {
    setSubTopicName(depth > 0.75 ? topic.S_topic_title : topic.M_topic_title);
    setEditingTopic(true);
    setIsOpen(true);
  };

  const changename = async () => {
    try {
      let result;
      if (depth > 0.75) {
        result = await renameSubtopic({
          rename_sub: subTopicName,
          subTopicId: topic.S_topic_id,
          mainTopicId: topic.M_topic_id,
        });
      } else {
        result = await renameMaintopic({
          rename_main: subTopicName,
          mainTopicId: topic.M_topic_id,
          status: topic.status,
        });
      }

      if (result.error) {
        showAlert(result.error, 'error');
        return;
      }

      setIsOpen(false);
      setEditingTopic(false);
      setSubTopicName('');
      handleUpdate();
      // Add this line to ensure the parent component knows about the update
      if (depth > 0.75 && topic.S_topic_id === currentSubTopicId) {
        onTopicUpdated?.();
      }
    } catch (error) {
      console.error('Error renaming topic:', error);
      showAlert('Error renaming topic: ' + error.message, 'error');
    }
  };

  const handleDelete = async (topicId) => {
    try {
      let result;
      if (depth > 0.75) {
        // Check if topic.SubTopics exists before calling filter
        const otherSubTopics = topic.SubTopics
          ? topic.SubTopics.filter((sub) => sub.S_topic_id !== topicId)
          : [];

        result = await deleteSubTopic({ subTopicId: topicId });

        // If we're deleting the currently selected subtopic, select another one
        if (topicId === currentSubTopicId) {
          if (otherSubTopics.length > 0) {
            onSelect(otherSubTopics[0].S_topic_id);
          } else {
            // Optional: handle case when no subtopics remain
            onSelect(null);
          }
        }
      } else {
        result = await deleteMainTopic({ mainTopicId: topicId });
      }

      if (result.error) {
        showAlert(result.error, 'error');
        return;
      }

      handleUpdate();
      showAlert('Topic deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting topic:', error);
      showAlert('Error deleting topic: ' + error.message, 'error');
    }
  };

  const handleCreateSubTopic = async () => {
    try {
      const result = await createSubTopic({
        newSubTopicName: subTopicName,
        mainTopicId: topic.M_topic_id,
        topicType,
      });

      if (result.error) {
        showAlert(result.error, 'error');
        return;
      }

      setIsOpen(false);
      setSubTopicName('');
      setTopicType('');
      handleUpdate();
      showAlert('Subtopic created successfully', 'success');
    } catch (error) {
      console.error('Error creating subtopic:', error);
      showAlert('Error creating subtopic: ' + error.message, 'error');
    }
  };

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
        className={`flex items-center ${
          depth <= 0.75
            ? 'border border-gray-200 p-3'
            : currentSubTopicId === topic.S_topic_id
              ? 'bg-blue-50 p-2'
              : 'p-2 hover:bg-gray-100'
        }`}
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
              className='hover: w-full cursor-pointer text-gray-500 hover:text-gray-700'
              onClick={() => handleSelect(topic.S_topic_id)}
            >
              {topic.S_topic_title}
            </span>
          ) : (
            <span
              className='w-full cursor-pointer text-gray-700'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {topic.M_topic_title}
            </span>
          )}
        </div>

        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly variant='light' className='text-gray-500'>
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
                  d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                />
              </svg>
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              onPress={() =>
                handleRename(
                  depth > 0.75 ? topic.S_topic_title : topic.M_topic_title
                )
              }
            >
              Rename
            </DropdownItem>
            <DropdownItem
              className='text-danger'
              color='danger'
              onPress={() =>
                handleDelete(depth > 0.75 ? topic.S_topic_id : topic.M_topic_id)
              }
            >
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {isExpanded && (
        <Droppable droppableId={`${topic.M_topic_id}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {topic.SubTopics?.sort((a, b) => a.Order - b.Order).map(
                (subtopic, index) => (
                  <Draggable
                    key={subtopic.S_topic_id}
                    draggableId={`${subtopic.S_topic_id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                      >
                        <TopicItem
                          topic={subtopic}
                          depth={depth + 1}
                          handleUpdate={handleUpdate}
                          onSelect={onSelect}
                          currentSubTopicId={currentSubTopicId}
                          showAlert={showAlert}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}

      {isExpanded && (
        <Button
          variant='bordered'
          className='mb-2 ml-8 mt-5 w-[calc(100%-32px)] border-dashed'
          onPress={() => {
            setEditingTopic(false);
            setIsOpen(true);
          }}
        >
          Add subtopic
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingTopic(false);
        }}
        hideCloseButton='true'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col items-center gap-1 text-xl font-bold'>
            {editingTopic ? 'Rename topic' : 'Create subtopic'}
          </ModalHeader>
          <ModalBody>
            <Input
              label={editingTopic ? 'New name' : 'Subtopic name'}
              labelPlacement='outside'
              placeholder='Enter title'
              variant='bordered'
              radius='sm'
              size='md'
              value={subTopicName}
              onChange={(e) => setSubTopicName(e.target.value)}
            />
            {!editingTopic && (
              <RadioGroup
                label='Type'
                onChange={(e) => setTopicType(e.target.value)}
              >
                <Radio value='L'>Lesson</Radio>
                <Radio value='EX'>Exercise</Radio>
                <Radio value='ET'>Exam test</Radio>
              </RadioGroup>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant='light'
              onPress={() => {
                setIsOpen(false);
                setSubTopicName('');
                setEditingTopic(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color='primary'
              onPress={editingTopic ? changename : handleCreateSubTopic}
              isDisabled={
                editingTopic ? !subTopicName : !subTopicName || !topicType
              }
            >
              {editingTopic ? 'Save' : 'Create'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

const TopicList = ({ handleSelect, onTopicUpdated, currentSubTopicId }) => {
  const [isCreateMain, setIscreateMain] = useState(false);
  const [mainTopicName, setMainTopicName] = useState('');
  const [topics, setTopics] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchTopics = async () => {
      const fetchedTopics = await getMainTopics();
      setTopics(fetchedTopics);
    };
    fetchTopics();
  }, [onTopicUpdated]);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
  };

  const handleCreateTopic = async () => {
    try {
      const result = await createMainTopic({ newMainTopicName: mainTopicName });

      if (result.error) {
        showAlert(result.error, 'error');
        return;
      }

      handleUpdate();
      setIscreateMain(false);
      setMainTopicName('');
      showAlert('Main topic created successfully', 'success');
    } catch (error) {
      console.error('Error creating main topic:', error);
      showAlert('Error creating main topic: ' + error.message, 'error');
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedTopics = await getMainTopics();
      setTopics(updatedTopics);
      onTopicUpdated?.();
    } catch (error) {
      console.error('Error fetching topics:', error);
      showAlert('Error fetching topics: ' + error.message, 'error');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const mainTopicId = parseInt(result.destination.droppableId);
    const subtopicId = parseInt(result.draggableId);

    // console.log(
    //   'handleDragEnd',
    //   sourceIndex,
    //   destinationIndex,
    //   mainTopicId,
    //   subtopicId
    // );
    if (sourceIndex === destinationIndex) return;
    // Create a copy of the current topics to manipulate
    const updatedTopics = [...topics];
    const mainTopicIndex = updatedTopics.findIndex(
      (topic) => topic.M_topic_id === mainTopicId
    );

    if (mainTopicIndex !== -1) {
      // Optimistically reorder subtopics
      const [removed] = updatedTopics[mainTopicIndex].SubTopics.splice(
        sourceIndex,
        1
      );
      updatedTopics[mainTopicIndex].SubTopics.splice(
        destinationIndex,
        0,
        removed
      );

      // Reorder the subtopics with new order values
      updatedTopics[mainTopicIndex].SubTopics = updatedTopics[
        mainTopicIndex
      ].SubTopics.map((subtopic, index) => ({
        ...subtopic,
        Order: index,
      }));

      // Update local state immediately
      setTopics(updatedTopics);
    }

    try {
      // Directly pass the new order information
      await updateSubtopicOrder({
        mainTopicId,
        subtopicId,
        sourceIndex,
        destinationIndex,
      });

      showAlert('Subtopic order updated successfully', 'success');
    } catch (error) {
      console.error('Error updating subtopic order:', error);

      // Revert the local state if the API call fails
      setTopics(topics);
      showAlert('Error updating subtopic order: ' + error.message, 'error');
    }
  };

  return (
    <div className='w-full pt-5'>
      <DragDropContext onDragEnd={handleDragEnd}>
        {alert.show && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        )}

        <div className='mb-4 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Topic list</h1>
          <Button
            color='default'
            variant='bordered'
            className='px-5'
            onPress={() => setIscreateMain(true)}
          >
            Create main topic
          </Button>
        </div>

        <ScrollShadow
          hideScrollBar
          orientation='horizontal'
          className='flex h-[calc(100vh-150px)] flex-col'
        >
          {topics.length > 0 ? (
            topics
              .sort((a, b) => a.M_topic_id - b.M_topic_id)
              .map((topic, index) => (
                <TopicItem
                  key={index}
                  topic={topic}
                  handleUpdate={handleUpdate}
                  onSelect={handleSelect}
                  currentSubTopicId={currentSubTopicId}
                  showAlert={showAlert}
                />
              ))
          ) : (
            <div className='flex h-full items-center justify-center rounded-xl border-2 border-gray-200 p-5'>
              <p className='text-gray-500'>No topics found</p>
            </div>
          )}
        </ScrollShadow>
        <Modal
          isOpen={isCreateMain}
          onClose={() => setIscreateMain(false)}
          hideCloseButton='true'
        >
          <ModalContent>
            <ModalHeader className='flex flex-col items-center gap-1 text-xl font-bold'>
              Create maintopic
            </ModalHeader>
            <ModalBody>
              <Input
                label='Maintopic name'
                labelPlacement='outside'
                placeholder='Enter title'
                variant='bordered'
                radius='sm'
                size='md'
                value={mainTopicName}
                onChange={(e) => setMainTopicName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant='light'
                onPress={() => {
                  setIscreateMain(false);
                  setMainTopicName('');
                }}
              >
                Cancel
              </Button>
              <Button
                color='primary'
                onPress={handleCreateTopic}
                isDisabled={!mainTopicName}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </DragDropContext>
    </div>
  );
};

export default TopicList;
