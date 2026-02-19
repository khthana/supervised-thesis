'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { getMainTopics } from '@/components/admin_components/Topic/service/useLeftSiteBar';
import GetTokenData from '@/components/GetTokenData';

// Dynamic imports with ssr disabled for components that might use browser APIs
const TopicList = dynamic(
  () => import('@/components/admin_components/Topic/LeftSiteBar'),
  { ssr: false }
);

const FrameEditing = dynamic(
  () => import('@/components/admin_components/Topic/FrameEditing'),
  { ssr: false }
);

export default function Topics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subTopicId, setSubTopicId] = useState(null);
  const [topics, setTopics] = useState([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = GetTokenData(token, 'role');

    if (!token || role !== '0') {
      router.push('/home');
    } else {
      setLoading(false);
    }
  }, [router]);

  // Existing useEffect for fetching topics
  useEffect(() => {
    if (!loading) {
      // Only fetch data if authenticated
      const fetchData = async () => {
        try {
          const data = await getMainTopics();
          setTopics(data);

          if (data.length > 0) {
            // Find all available subtopics across all main topics
            const allSubTopics = data.flatMap((topic) => topic.SubTopics || []);

            // Sort subtopics by Order and select the first one
            const sortedSubTopics = allSubTopics.sort(
              (a, b) => a.Order - b.Order
            );

            // If we don't have a selected subtopic or current one doesn't exist
            if (
              !subTopicId ||
              !allSubTopics.some((sub) => sub.S_topic_id === subTopicId)
            ) {
              const firstSubTopic = sortedSubTopics[0];
              if (firstSubTopic) {
                setSubTopicId(firstSubTopic.S_topic_id);
                setSelectedSubtopic(firstSubTopic);
              } else {
                setSubTopicId(null);
                setSelectedSubtopic(null);
              }
            } else {
              // Update selected subtopic data if it exists
              const currentSubTopic = allSubTopics.find(
                (sub) => sub.S_topic_id === subTopicId
              );
              if (currentSubTopic) {
                setSelectedSubtopic(currentSubTopic);
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch topics:', error);
        }
        setNeedsUpdate(false);
      };

      fetchData();
    }
  }, [needsUpdate, subTopicId, loading]);

  const handleKeepdata = (subId) => {
    setSubTopicId(subId);
  };

  const handleTopicUpdated = () => {
    setNeedsUpdate((prev) => !prev); // Toggle to force refresh
  };

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
      </div>
    );
  }

  return (
    <div className='min-h-[calc(100vh-60px)]'>
      <div className='PaddingXSet'>
        <div className='w-1/4'>
          <TopicList
            handleSelect={handleKeepdata}
            onTopicUpdated={handleTopicUpdated}
            currentSubTopicId={subTopicId}
          />
        </div>
        <div className='w-full pl-5 pt-5'>
          {subTopicId ? (
            <FrameEditing
              SubtopicId={subTopicId}
              onTopicDeleted={handleTopicUpdated}
              onTopicUpdated={needsUpdate}
            />
          ) : (
            <div className='flex h-[calc(100vh-200px)] flex-col items-center justify-center rounded-xl border-2 border-gray-200 p-5'>
              <p className='text-lg font-bold text-gray-500'>No content</p>
              <p className='text-sm font-light text-gray-500'>
                Please create a subtopic before editing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
