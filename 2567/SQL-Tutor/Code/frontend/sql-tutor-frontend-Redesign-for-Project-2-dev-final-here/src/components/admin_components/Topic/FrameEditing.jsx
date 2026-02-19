import CodeEditor from './CodeEditor';
import Output from './Output';
import Myeditor from './QuillEditor/richTextEditor';
import {
  Button,
  Select,
  SelectItem,
  Chip,
  ScrollShadow,
  Alert,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { CreateContents, GetSubTopic } from './service/userService';
import { deleteSubTopic } from './service/useLeftSiteBar';
import GetTokenData from '@/components/GetTokenData';

export default function FrameEditing({
  SubtopicId,
  onTopicDeleted,
  onTopicUpdated,
}) {
  const selectCommand = [
    { color: 'primary', key: 'DQL', label: 'Data query language' },
    { color: 'warning', key: 'DML', label: 'Data Manipulation Language' },
  ];
  const [contents, setContents] = useState('');
  const [output, setOutput] = useState('');
  const [subtopicData, setSubtopicdata] = useState(null);
  const [saveAlert, setSavealert] = useState({
    show: false,
    color: 'success',
    message: '',
  });
  const [selectedCommands, setSelectedCommands] = useState([]);
  const [clearEditor, setClearEditor] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetSubTopic(SubtopicId);
        if (!data) {
          onTopicDeleted?.();
          return;
        }
        setSubtopicdata(data);
        setClearEditor(true);

        // Reset clear flag after a short delay
        setTimeout(() => {
          setClearEditor(false);
        }, 10);

        // Use optional chaining and provide a default empty array
        const initialQueryType = data?.Contents?.[0]?.Query_type || 'DQL';
        setSelectedCommands([initialQueryType]);
      } catch (error) {
        console.error('Error fetching subtopic:', error);
        onTopicDeleted?.();
      }
    };

    if (SubtopicId) {
      fetchData();
    }
  }, [SubtopicId, refreshKey]);

  useEffect(() => {
    if (saveAlert.show) {
      const timer = setTimeout(() => {
        setSavealert((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveAlert.show]);

  useEffect(() => {
    setRefreshKey((prev) => prev + 1);
  }, [onTopicUpdated]);

  const handleOutput = (value) => {
    setOutput(value);
    // console.log('output:', value);
    return value;
  };

  const handleDelete = async () => {
    try {
      await deleteSubTopic({ subTopicId: SubtopicId });
      onTopicDeleted?.(); // This will now trigger a full update
      setSavealert({
        show: true,
        color: 'success',
        message: '✅ ลบเนื้อหาสำเร็จ',
      });
    } catch (error) {
      setSavealert({
        show: true,
        color: 'danger',
        message: `❌ ไม่สามารถลบเนื้อหาได้: ${error.message}`,
      });
    }
  };

  const handleContents = (contents) => {
    setContents(contents);
  };

  const handleSave = async () => {
    try {
      await CreateContents(contents, subtopicData, selectedCommands);
      setSavealert({
        show: true,
        color: 'success',
        message: '✅ บันทึกเนื้อหาสำเร็จ',
      });
    } catch (error) {
      setSavealert({
        show: true,
        color: 'danger',
        message: `❌ ไม่สามารถบันทึกเนื้อหาได้: ${error.message}`,
      });
    }
  };

  const handleSelect = async (selectedItems) => {
    // Perform actions based on selected commands
  };

  return (
    <div>
      <header className='mb-4'>
        <div className='text-2xl font-bold'>
          {!subtopicData ? '' : subtopicData.S_topic_title}
        </div>
      </header>
      <ScrollShadow
        hideScrollBar
        size={20}
        className='flex max-h-[78vh] flex-col pb-4 sm:pr-10 md:pr-20 lg:pr-20'
      >
        <div className='flex flex-col gap-4'>
          <div>
            <Myeditor
              getContext={handleContents}
              contentsid={subtopicData?.Contents?.[0]?.Content_id}
              size='65vh'
            />
          </div>
          <div className='flex flex-row justify-end'>
            <Select
              className='items-center sm:w-full md:w-4/6 lg:w-1/3'
              label='Command'
              labelPlacement='outside-left'
              placeholder='Select command to use'
              variant='bordered'
              size='lg'
              // Track selected keys
              selectedKeys={new Set(selectedCommands)}
              // Handle selection change
              onSelectionChange={(keys) => {
                const selectedKeys = Array.from(keys);
                setSelectedCommands(selectedKeys);

                // Call handleSelect when selection changes
                handleSelect(selectedKeys);
              }}
              renderValue={(items) => (
                <ScrollShadow
                  orientation='horizontal'
                  hideScrollBar
                  className='md:max-w-4/5 lg:max-w-1/2 flex gap-2 sm:max-w-full'
                >
                  {items.map((item) => (
                    <Chip
                      radius='sm'
                      variant='flat'
                      className='p-4'
                      key={item.key}
                      color={item.props.value}
                    >
                      {item.textValue}
                    </Chip>
                  ))}
                </ScrollShadow>
              )}
            >
              {selectCommand.map((command) => (
                <SelectItem
                  key={command.key}
                  textValue={command.label}
                  value={command.color}
                >
                  {command.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            <CodeEditor
              handleOutput={handleOutput}
              QType={subtopicData?.Contents?.[0]?.Query_type}
              clearEditor={clearEditor}
              selectedCommands={selectedCommands}
            />
          </div>
          <div>
            <Output
              result={output}
              content_Id={subtopicData?.Contents?.[0]?.Content_id}
              content_Type={subtopicData?.Type}
            />
          </div>
        </div>
      </ScrollShadow>
      <footer className='rg:pr-20 flex flex-row justify-end gap-4 pt-2 sm:pr-10 md:pr-20'>
        {saveAlert.show && (
          <Alert
            color={saveAlert.color}
            title={saveAlert.message}
            hideIcon
            className='p-0'
          />
        )}
        <Button variant='light' color='danger' onPress={handleDelete}>
          Delete
        </Button>
        <Button variant='flat' color='success' onPress={handleSave}>
          Save
        </Button>
      </footer>
    </div>
  );
}
