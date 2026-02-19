'use client';
import { useEffect, useState } from 'react';
import CodeEditor from '@/components/admin_components/Topic/CodeEditor';
import Output from '@/components/admin_components/Topic/Output';
import { fetchContent, updateProgress } from './service/courseService';
import { Button, ScrollShadow } from '@heroui/react';
import 'react-quill-new/dist/quill.snow.css';

const L_arrow = ({ onClick, canGoPrev }) => (
  <Button
    isIconOnly
    variant='link'
    disableRipple
    onPress={onClick}
    isDisabled={!canGoPrev}
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='35'
      height='35'
      viewBox='0 0 40 40'
      fill={canGoPrev ? '#525252' : '#D3D3D3'} // Dark when enabled, light gray when disabled
    >
      <path d='M3.33325 19.9999C3.33325 29.1999 10.7999 36.6666 19.9999 36.6666C29.1999 36.6666 36.6666 29.1999 36.6666 19.9999C36.6666 10.7999 29.1999 3.33325 19.9999 3.33325C10.7999 3.33325 3.33325 10.7999 3.33325 19.9999ZM19.9999 15.3499V18.3332H24.9999C25.9166 18.3332 26.6666 19.0832 26.6666 19.9999C26.6666 20.9166 25.9166 21.6666 24.9999 21.6666H19.9999V24.6499C19.9999 25.3999 19.0999 25.7666 18.5832 25.2332L13.9332 20.5833C13.5999 20.2499 13.5999 19.7332 13.9332 19.3999L18.5832 14.7499C18.7007 14.6347 18.8497 14.5569 19.0113 14.5263C19.173 14.4956 19.3401 14.5135 19.4916 14.5777C19.6431 14.6418 19.7722 14.7494 19.8627 14.8868C19.9531 15.0243 20.0009 15.1854 19.9999 15.3499Z' />
    </svg>
  </Button>
);

const R_arrow = ({
  onClick,
  contentID,
  onProgressUpdate,
  ansStatus,
  canGoNext,
  contentType,
  contentState,
}) => {
  const isEnabled =
    (contentType === 'L' && canGoNext) ||
    (contentType !== 'L' && ansStatus && canGoNext) ||
    contentState === 'pass';

  console.log('isEnabled', isEnabled);

  const isDisabled = !isEnabled;

  return (
    <Button
      isIconOnly
      variant='link'
      disableRipple
      onPress={() => {
        if (isEnabled) {
          // Always update progress when clicked and enabled
          // For both 'L' type content and non-'L' type with correct answer (ansStatus true)
          if (contentType === 'L' || ansStatus) {
            handleupdateProgress(contentID, onProgressUpdate, true);
          }
          onClick();
        }
      }}
      isDisabled={isDisabled}
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='35'
        height='35'
        viewBox='0 0 40 40'
        fill={isDisabled ? '#D3D3D3' : '#525252'}
      >
        <path d='M36.6668 19.9999C36.6668 10.7999 29.2002 3.33325 20.0002 3.33325C10.8002 3.33325 3.3335 10.7999 3.3335 19.9999C3.3335 29.1999 10.8002 36.6666 20.0002 36.6666C29.2002 36.6666 36.6668 29.1999 36.6668 19.9999ZM20.0002 24.6499V21.6666H15.0002C14.0835 21.6666 13.3335 20.9166 13.3335 19.9999C13.3335 19.0832 14.0835 18.3332 15.0002 18.3332H20.0002V15.3499C20.0002 14.5999 20.9002 14.2332 21.4168 14.7666L26.0668 19.4166C26.4002 19.7499 26.4002 20.2666 26.0668 20.5999L21.4168 25.2499C21.2993 25.3651 21.1504 25.4429 20.9887 25.4736C20.8271 25.5042 20.66 25.4863 20.5085 25.4222C20.357 25.358 20.2279 25.2504 20.1374 25.113C20.0469 24.9756 19.9992 24.8144 20.0002 24.6499Z' />
      </svg>
    </Button>
  );
};

const handleupdateProgress = async (
  content_id,
  onProgressUpdate,
  ansStatus
) => {
  try {
    if (ansStatus) {
      await updateProgress(content_id, 'pass');
      if (onProgressUpdate) {
        await onProgressUpdate('pass');
      }
    }
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};

export default function ShowContents({
  topicdata,
  onProgressUpdate,
  onNavigate,
  allTopics,
}) {
  const [content, setContent] = useState([]);
  const [constentState, setConstentState] = useState({
    success: false,
    message: '',
  });
  const [output, setOutput] = useState('');
  const [clearEditor, setClearEditor] = useState(false);

  const handleOutput = (output) => {
    setOutput(output);
    setConstentState({ success: false, message: '' });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (topicdata?.Contents?.[0]?.Content_id) {
        const data = await fetchContent(topicdata.Contents[0].Content_id);
        setContent(data?.Content_info);
        setClearEditor(true);

        // Reset clear flag after a short delay
        setTimeout(() => {
          setClearEditor(false);
        }, 10);

        // Changed logic for setting content state
        if (topicdata?.Type === 'L') {
          // For learning content, set to success only if it's already passed
          if (topicdata?.Contents?.[0]?.state === 'pass') {
            setConstentState({ success: true, message: 'pass' });
          } else {
            // For new learning content, start as not completed
            setConstentState({ success: false, message: 'wait' });
          }
        } else {
          // For other types, keep existing logic
          setConstentState({ success: false, message: 'wait' });
        }
      }
    };
    fetchData();
  }, [topicdata]);

  const handleNavigation = (direction) => {
    // Trigger clearing of editor and output
    setClearEditor(true);

    // Reset clear flag after a short delay
    setTimeout(() => {
      setClearEditor(false);
    }, 100);

    // Call original navigation
    onNavigate(direction);
  };

  const canNavigate = (direction) => {
    if (!topicdata || !allTopics) return false;

    // Find current main topic and its index
    let currentMainTopicIndex = -1;
    let currentMainTopic = null;

    for (let i = 0; i < allTopics.length; i++) {
      const mainTopic = allTopics[i];
      const subTopicExists = mainTopic.SubTopics.some(
        (sub) => sub.S_topic_id === topicdata.S_topic_id
      );
      if (subTopicExists) {
        currentMainTopicIndex = i;
        currentMainTopic = mainTopic;
        break;
      }
    }

    if (!currentMainTopic) return false;

    const sortedSubTopics = currentMainTopic.SubTopics.sort(
      (a, b) => a.Order - b.Order
    );

    const currentSubTopicIndex = sortedSubTopics.findIndex(
      (sub) => sub.S_topic_id === topicdata.S_topic_id
    );

    if (direction === 'next') {
      // For learning content (Type 'L'), allow navigation to next topic

      // Check next subtopic in current main topic
      if (currentSubTopicIndex < sortedSubTopics.length - 1) {
        return true; // Always allow navigation to next subtopic for learning content
      }

      // Check next main topic
      if (currentMainTopicIndex < allTopics.length - 1) {
        return true; // Allow navigation to next main topic for learning content
      }
    }

    if (direction === 'prev') {
      // Allow backward navigation for learning content
      if (topicdata.Type === 'L') {
        return currentSubTopicIndex > 0 || currentMainTopicIndex > 0;
      }

      // For non-learning content, check lock status
      if (currentSubTopicIndex > 0) {
        const prevTopic = sortedSubTopics[currentSubTopicIndex - 1];
        return prevTopic.Contents[0]?.state !== 'lock';
      }
    }

    return false;
  };

  const canGoNext = canNavigate('next');
  const canGoPrev = canNavigate('prev');

  const handleAns = (data) => {
    console.log('data:', data);
    // data = {"success":true,"message":"คำตอบถูกต้อง"}
    setConstentState({ success: data.success, message: data.message });
    // console.log('constentState:', constentState.success);
  };

  return (
    <div>
      <header className='rg:pr-20 mb-4 flex items-center justify-between sm:pr-10 md:pr-20'>
        <L_arrow
          onClick={() => canGoPrev && handleNavigation('prev')}
          canGoPrev={canGoPrev}
        />
        <div className='text-lg font-bold'>{topicdata?.S_topic_title}</div>
        <R_arrow
          onClick={() => canGoNext && handleNavigation('next')}
          contentID={topicdata?.Contents?.[0]?.Content_id}
          onProgressUpdate={onProgressUpdate}
          ansStatus={constentState.success}
          canGoNext={canGoNext}
          contentType={topicdata?.Type} // Add this prop
          contentState={topicdata?.Contents?.[0]?.state}
        />
      </header>
      <ScrollShadow
        hideScrollBar
        size={10}
        className='rg:pr-20 flex max-h-[calc(100vh-140px)] flex-col gap-4 sm:pr-10 md:pr-20'
      >
        <div className='ql-snow'>
          <div
            className='ql-editor'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <div>
          <CodeEditor
            handleOutput={handleOutput}
            content_Type={topicdata?.Type}
            content_Id={topicdata?.Contents?.[0]?.Content_id}
            onANS={handleAns}
            clearEditor={clearEditor}
            QType={topicdata?.Contents?.[0]?.Query_type}
          />
        </div>
        <div>
          <Output result={output} showMissing={constentState} />
        </div>
      </ScrollShadow>
    </div>
  );
}
