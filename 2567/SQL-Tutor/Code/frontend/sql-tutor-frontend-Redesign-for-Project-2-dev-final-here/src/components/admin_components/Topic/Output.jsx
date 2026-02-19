'use client';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config/api';
import GetTokenData from '@/components/GetTokenData';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ScrollShadow,
  Alert,
} from '@heroui/react';

export default function Output({
  result,
  content_Id,
  content_Type,
  showMissing,
}) {
  // console.log('showMissing', showMissing);
  const res = result;
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [answerAlert, setAnsweralert] = useState({
    show: false,
    color: 'success',
    message: '',
  });

  useEffect(() => {
    if (res) {
      if (res.success && res.data > []) {
        // console.log('res', res);
        setRows(res.data.map((item, index) => ({ key: index, ...item })));
        setColumns(
          Object.keys(res.data[0]).map((key) => {
            return { key: key, label: key };
          })
        );
      } else {
        setColumns([]);
        setRows([]);
      }
    }
  }, [res]);

  useEffect(() => {
    if (answerAlert.show) {
      const timer = setTimeout(() => {
        setAnsweralert((prev) => ({ ...prev, show: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [answerAlert.show]);

  // post answer
  const postAnswer = async (answer) => {
    try {
      let response = await fetch(`${API_BASE_URL}/api/course/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId: content_Id,
          result: answer,
        }),
      });
      const data = await response.json();
      setAnsweralert({
        show: true,
        color: 'success',
        message: '✅ บันทึกคำตอบสำเร็จ',
      });
    } catch (error) {
      setAnsweralert({
        show: true,
        color: 'danger',
        message: `❌ ไม่สามารถบันทึกคำตอบได้: ${error.message}`,
      });
    }
  };

  return (
    <div>
      <div className='h-80 rounded-xl border border-gray-300 bg-slate-200'>
        <div className='flex flex-row justify-between px-5 py-3'>
          <p className='w-1/6 content-center text-sm font-semibold'>Output</p>
          <div className='flex w-5/6 flex-row justify-end gap-2'>
            {answerAlert.show && (
              <Alert
                color={answerAlert.color}
                title={answerAlert.message}
                hideIcon
                className='w-5/6 p-0'
              />
            )}

            {GetTokenData(localStorage.getItem('token'), 'role') === '0' ? (
              content_Type === 'EX' || content_Type === 'ET' ? (
                <Button
                  className='w-1/6 rounded-md bg-gray-800 px-5 py-0 text-sm font-medium text-gray-200 hover:bg-gray-500'
                  onPress={() => postAnswer(res.data)}
                >
                  Send answers
                </Button>
              ) : null
            ) : null}
          </div>
        </div>
        <div>
          <div className='border-t border-gray-300 bg-slate-200 p-2'>
            {res.success ? (
              rows.length > 0 ? (
                <ScrollShadow
                  orientation='horizontal'
                  hideScrollBar
                  className='h-full max-h-64'
                >
                  {!showMissing?.success && showMissing?.message && (
                    <Alert
                      color='danger'
                      title={showMissing.message}
                      hideIcon
                      className='my-2 w-full p-2'
                    />
                  )}
                  <Table
                    aria-label='SQL PlayGround'
                    layout='fixed'
                    isHeaderSticky={true}
                  >
                    <TableHeader columns={columns}>
                      {(column) => (
                        <TableColumn key={column.key}>
                          {column.label}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody
                      emptyContent={'Enter command to Code Editor..'}
                      items={rows}
                    >
                      {(item) => (
                        <TableRow key={item.key}>
                          {(columnKey) => (
                            <TableCell>{item[columnKey]}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollShadow>
              ) : (
                <div>{res.message}</div>
              )
            ) : (
              <div className='p-4 font-semibold text-red-500'>
                {res.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
