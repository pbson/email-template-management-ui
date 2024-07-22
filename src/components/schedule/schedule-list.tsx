import React from 'react';
import { Download, Edit, Trash } from 'lucide-react';

interface ScheduleListProps {
  schedules: any[];
  onDelete: (id: number) => void;
  onEdit: (schedule: any) => void;
  onExport: (schedule: any) => void;
}

const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  onDelete,
  onEdit,
  onExport,
}) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {[
              'Job Name',
              'Description',
              'Frequency',
              'Next Send',
              'Status',
              'Actions',
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {schedules.map((schedule) => (
            <tr
              key={schedule.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {schedule.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {schedule.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {schedule.recurrence?.frequency}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(schedule.start_timestamp).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    schedule.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {schedule.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onExport(schedule)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    aria-label="View"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(schedule)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(schedule.id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    aria-label="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
