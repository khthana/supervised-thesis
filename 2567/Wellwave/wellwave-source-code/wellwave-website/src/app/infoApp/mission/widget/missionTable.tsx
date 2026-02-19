// components/TaskTable.tsx
import React from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

interface Task {
  name: string;
  category: string;
  reward: number;
  successRate: string;
  participants: string;
  status: string;
}

interface TaskTableProps {
  tasks: Task[];
  onSort: (column: keyof Task) => void;
  sortConfig: { column: keyof Task | null; direction: number };
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onSort, sortConfig }) => {
  const getIcon = (column: keyof Task) => {
    if (sortConfig.column !== column) return <FaSort className="inline" />;
    if (sortConfig.direction === 1) return <FaSortUp className="inline" />;
    if (sortConfig.direction === 2) return <FaSortDown className="inline" />;
    return <FaSort className="inline" />;
  };

  return (
    <div className="overflow-auto scrollbar-custom flex-grow mt-4 max-h-[400px]">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="py-2 text-left" onClick={() => onSort('name')}>
              ชื่อภารกิจ {getIcon('name')}
            </th>
            <th className="py-2 text-left" onClick={() => onSort('category')}>
              หมวดหมู่ {getIcon('category')}
            </th>
            <th className="py-2 text-left" onClick={() => onSort('reward')}>
              รางวัล {getIcon('reward')}
            </th>
            <th className="py-2 text-left" onClick={() => onSort('successRate')}>
              อัตราความสำเร็จ {getIcon('successRate')}
            </th>
            <th className="py-2 text-left" onClick={() => onSort('participants')}>
              ผู้เข้าร่วม {getIcon('participants')}
            </th>
            <th className="py-2 text-left" onClick={() => onSort('status')}>
              สถานะ {getIcon('status')}
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{task.name}</td>
              <td className="px-4 py-2">{task.category}</td>
              <td className="px-4 py-2">{task.reward}</td>
              <td className="px-4 py-2">{task.successRate}</td>
              <td className="px-4 py-2">{task.participants}</td>
              <td className="px-4 py-2">{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
