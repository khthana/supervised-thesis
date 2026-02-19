'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TopicListUser from '@/components/User_components/Learn/LeftSiteBar';
import ShowContents from '@/components/User_components/Learn/ShowContents';
import { fetchTopics } from '@/components/User_components/Learn/service/courseService';
import Nodata from '/public/favicon/No data-rafiki.png';
import Image from 'next/image';

const Learn = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTopic, setUserTopic] = useState(null);
  const [userContent, setUserContent] = useState([]);
  const [refreshKey, setRefreshKey] = useState('update');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    const data = await fetchTopics();
    setUserContent(data.data);

    // If no topic is selected, set the first available topic
    if (!userTopic) {
      const firstAvailableTopic = findFirstAvailableTopic(data.data);
      if (!firstAvailableTopic.error) {
        setUserTopic(firstAvailableTopic);
      } else {
        setUserTopic({ error: true, message: firstAvailableTopic.message });
      }
    }
  }, [userTopic, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [fetchData, refreshKey, isAuthenticated]);

  const findFirstAvailableTopic = (mainTopics) => {
    if (!mainTopics || !Array.isArray(mainTopics) || mainTopics.length === 0) {
      return {
        error: true,
        message: 'No topics are currently available',
      };
    }

    let hasSubTopics = false;
    for (const mainTopic of mainTopics) {
      if (!mainTopic?.SubTopics) continue;
      hasSubTopics = true;

      const sortedSubTopics = mainTopic.SubTopics.sort(
        (a, b) => a.Order - b.Order
      );

      const availableTopic = sortedSubTopics.find(
        (topic) =>
          topic?.Contents?.[0]?.state === 'wait' ||
          topic?.Contents?.[0]?.state === 'pass'
      );

      if (availableTopic) return availableTopic;
    }

    if (!hasSubTopics) {
      return {
        error: true,
        message: 'No subtopics found in any main topic',
      };
    }

    return {
      error: true,
      message: "No available topics found with 'wait' or 'pass' state",
    };
  };

  const findNextAvailableTopic = (currentTopic) => {
    // Find current main topic and its subtopics
    let currentMainTopicIndex = -1;
    let currentMainTopic = null;

    for (let i = 0; i < userContent.length; i++) {
      const mainTopic = userContent[i];
      if (
        mainTopic.SubTopics.some(
          (sub) => sub.S_topic_id === currentTopic.S_topic_id
        )
      ) {
        currentMainTopicIndex = i;
        currentMainTopic = mainTopic;
        break;
      }
    }

    if (!currentMainTopic) return null;

    const sortedSubTopics = currentMainTopic.SubTopics.sort(
      (a, b) => a.Order - b.Order
    );

    const currentSubTopicIndex = sortedSubTopics.findIndex(
      (sub) => sub.S_topic_id === currentTopic.S_topic_id
    );

    // Try to find next topic in current main topic
    if (currentSubTopicIndex < sortedSubTopics.length - 1) {
      const allPreviousCompleted = sortedSubTopics
        .slice(0, currentSubTopicIndex + 1)
        .every((sub) => sub.Contents[0]?.state === 'pass');

      if (allPreviousCompleted) {
        return sortedSubTopics[currentSubTopicIndex + 1];
      }
      return null;
    }

    // If we're at the last subtopic of current main topic
    // Check if we can move to the next main topic
    if (currentMainTopicIndex < userContent.length - 1) {
      // Check if ALL subtopics in current main topic are completed
      const allCurrentMainTopicCompleted = sortedSubTopics.every(
        (sub) => sub.Contents[0]?.state === 'pass'
      );

      if (allCurrentMainTopicCompleted) {
        // Move to first subtopic of next main topic
        const nextMainTopic = userContent[currentMainTopicIndex + 1];
        const nextMainTopicSubTopics = nextMainTopic.SubTopics.sort(
          (a, b) => a.Order - b.Order
        );

        // Return first subtopic of next main topic if it's available
        if (nextMainTopicSubTopics.length > 0) {
          return nextMainTopicSubTopics[0];
        }
      }
    }

    return null;
  };

  const findPreviousAvailableTopic = (currentTopic) => {
    // Find current main topic and its subtopics
    let currentMainTopicIndex = -1;
    let currentMainTopic = null;

    for (let i = 0; i < userContent.length; i++) {
      const mainTopic = userContent[i];
      if (
        mainTopic.SubTopics.some(
          (sub) => sub.S_topic_id === currentTopic.S_topic_id
        )
      ) {
        currentMainTopicIndex = i;
        currentMainTopic = mainTopic;
        break;
      }
    }

    if (!currentMainTopic) return null;

    const sortedSubTopics = currentMainTopic.SubTopics.sort(
      (a, b) => a.Order - b.Order
    );

    const currentSubTopicIndex = sortedSubTopics.findIndex(
      (sub) => sub.S_topic_id === currentTopic.S_topic_id
    );

    // Try to find previous topic in current main topic
    if (currentSubTopicIndex > 0) {
      // Look for a previous subtopic that is available
      for (let i = currentSubTopicIndex - 1; i >= 0; i--) {
        const previousTopic = sortedSubTopics[i];
        if (
          previousTopic.Contents[0]?.state === 'wait' ||
          previousTopic.Contents[0]?.state === 'pass'
        ) {
          return previousTopic;
        }
      }
    }

    // If we're at the first subtopic of current main topic
    // Check if we can move to the previous main topic
    if (currentMainTopicIndex > 0) {
      const previousMainTopic = userContent[currentMainTopicIndex - 1];
      const previousMainTopicSubTopics = previousMainTopic.SubTopics.sort(
        (a, b) => a.Order - b.Order
      );

      // Find the last available subtopic in the previous main topic
      for (let i = previousMainTopicSubTopics.length - 1; i >= 0; i--) {
        const previousTopic = previousMainTopicSubTopics[i];
        if (
          previousTopic.Contents[0]?.state === 'wait' ||
          previousTopic.Contents[0]?.state === 'pass'
        ) {
          return previousTopic;
        }
      }
    }

    return null;
  };

  const handleKeepData = (subId) => {
    setUserTopic(subId);
  };

  const handleProgressUpdate = async (newState) => {
    setRefreshKey((prev) => prev + 1); // Force refresh of topic list
  };

  const handleNavigation = (direction) => {
    if (!userTopic) return;

    const nextTopic =
      direction === 'next'
        ? findNextAvailableTopic(userTopic)
        : findPreviousAvailableTopic(userTopic);

    if (nextTopic) {
      setUserTopic(nextTopic);
    }
  };

  // Loading state and rendering logic remain the same as in the previous implementation
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
          <p className='text-lg'>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const noTopics = !userContent || userContent.length === 0;

    return (
      <div className='min-h-[calc(100vh-60px)]'>
        <div className='PaddingXSet'>
          {noTopics ? (
            <div className='flex h-[calc(100vh-100px)] w-full items-center justify-center'>
              <div className='text-center'>
                <Image
                  src={Nodata}
                  alt='No data'
                  width={550}
                  height={550}
                  className='mx-auto'
                />
                <h2 className='mb-4 text-2xl font-semibold text-gray-700'>
                  No Topics Available
                </h2>
                <p className='text-gray-500'>
                  There are currently no learning topics available. Please check
                  back later.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className='w-1/4 pt-5'>
                <TopicListUser
                  handleSelect={handleKeepData}
                  updateProgress={refreshKey}
                />
              </div>
              <div className='ml-5 w-full pt-5'>
                <ShowContents
                  topicdata={userTopic?.error ? null : userTopic}
                  errorMessage={userTopic?.error ? userTopic.message : null}
                  onProgressUpdate={handleProgressUpdate}
                  onNavigate={handleNavigation}
                  allTopics={userContent}
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default Learn;
