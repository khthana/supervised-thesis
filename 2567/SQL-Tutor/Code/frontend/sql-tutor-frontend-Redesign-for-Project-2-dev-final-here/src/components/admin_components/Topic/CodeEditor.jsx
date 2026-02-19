'use client';

import { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@heroui/react';
import { API_BASE_URL } from '@/config/api';
import GetTokenData from '@/components/GetTokenData';
import { resetDB } from './service/userService';

export default function CodeEditor({
  handleOutput,
  defaultValue = '-- Write your code here',
  content_Type,
  content_Id,
  onANS,
  clearEditor, // New prop to trigger clearing
  QType,
  selectedCommands,
}) {
  const editorRef = useRef();
  const [value, setValue] = useState(defaultValue);
  const [data, setData] = useState(null);
  // console.log('QType', QType);
  // console.log('selectedCommands', selectedCommands);
  // Reset editor when clearEditor prop changes
  useEffect(() => {
    if (clearEditor) {
      setValue(defaultValue);
      setData(null);
      handleOutput(''); // Clear output
    }
  }, [clearEditor, defaultValue, handleOutput]);

  // useEffect(() => {
  //   // Simply log the selected commands
  //   if (selectedCommands.length > 0) {
  //     // Log the selected commands for debugging
  //     console.log('Selected Commands in CodeEditor:', selectedCommands);

  //     // Perform any necessary setup based on selected commands
  //     if (selectedCommands.includes('DML')) {
  //       // Perform any DML-specific setup
  //       console.log('Switched to DML mode');
  //     } else if (selectedCommands.includes('DQL')) {
  //       // Perform any DQL-specific setup
  //       console.log('Switched to DQL mode');
  //     }
  //   }
  // }, [selectedCommands]);

  const handleAns = (data) => {
    // console.log('data:', data);
    onANS(data);
  };

  const handleAnswer = async (value) => {
    // console.log('value:', value);
    // console.log(API_BASE_URL);
    if (!value) {
      return;
    } else {
      try {
        let res = await fetch(
          `${API_BASE_URL}/api/course/contents/${content_Id}/check`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userResult: value }),
          }
        );
        const ans = await res.json();
        // console.log('Ans_Response:', ans);
        handleAns(ans);
      } catch (error) {
        console.error('Error post answer:', error);
      }
    }
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    const userId = GetTokenData(localStorage.getItem('token'), 'accountID');
    const queryType = (selectedCommands && selectedCommands[0]) || QType;
    // console.log('runCode', sourceCode, userId, selectedCommands, QType);
    if (!sourceCode) return;
    try {
      // console.log('Running code...', sourceCode);
      let response = await fetch(`${API_BASE_URL}/api/course/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: sourceCode,
          userId: userId,
          queryType: queryType,
        }),
      });
      const res = await response.json();
      setData(res);
      handleOutput(res);
    } catch (error) {
      console.error('Error running code:', error);
    }
  };

  const handleReset = async () => {
    try {
      // Get the user ID from the token
      const userId = GetTokenData(localStorage.getItem('token'), 'accountID');

      // Call the resetDB service function
      await resetDB({ userId });

      // Optionally, you might want to clear the editor or show a success message
      setValue(defaultValue);
      setData(null);
      handleOutput(''); // Clear output
    } catch (error) {
      console.error('Error resetting database:', error);
      // Optionally show an error message to the user
    }
  };

  return (
    <div>
      <div className='rounded-xl bg-zinc-800'>
        <div className='flex flex-row content-center justify-between px-5 py-3'>
          <div>
            <p className='text-sm font-semibold text-white'>Code Editor</p>
          </div>
        </div>
        <Editor
          height={300}
          defaultLanguage='sql'
          value={value}
          defaultValue={defaultValue}
          theme='vs-dark'
          onMount={onMount}
          onChange={(value) => setValue(value)}
          options={{
            minimap: { enabled: false },
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'auto',
            },
            fontSize: 16,
            lineHeight: 24,
          }}
        />
        <div className='flex w-full justify-between px-5 py-2'>
          {QType === 'DML' ||
          (selectedCommands && selectedCommands[0] === 'DML') ? (
            <Button size='sm' radius='sm' onPress={handleReset}>
              Reset DB
            </Button>
          ) : (
            <div></div>
          )}
          <div className='flex flex-row gap-2'>
            <Button size='sm' radius='sm' onPress={runCode}>
              Run
            </Button>

            {GetTokenData(localStorage.getItem('token'), 'role') === '1' ? (
              content_Type === 'EX' || content_Type === 'ET' ? (
                <div className='flex flex-row'>
                  <Button
                    size='sm'
                    radius='sm'
                    onPress={() => handleAnswer(data?.data)}
                    isDisabled={!data}
                    color='success'
                  >
                    submit
                  </Button>
                </div>
              ) : (
                <div></div>
              )
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
