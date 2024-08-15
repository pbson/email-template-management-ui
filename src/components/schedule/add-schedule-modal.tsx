import React, { useState, useEffect } from 'react';
import scheduleApi from '@/features/schedule/schedule.api';
import caseApi from '@/features/case/services/case.api';
import userApi from '@/features/user/services/user.api';
import { X } from 'lucide-react';
import { formatDatetimeLocal } from '@/utils/date';
import toast from 'react-hot-toast';
import { CheckboxMultiSelect } from './checkbox';

interface AddScheduleModalProps {
  show: boolean;
  onHide: () => void;
  onSave: () => void;
  schedule?: any;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  show,
  onHide,
  onSave,
  schedule,
}) => {
  const [name, setName] = useState(schedule?.name || '');
  const [description, setDescription] = useState(schedule?.description || '');
  const [frequency, setFrequency] = useState(
    schedule?.recurrence?.frequency || 'OneTime',
  );
  const [interval, setInterval] = useState(schedule?.recurrence?.interval || 1);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(
    schedule?.recurrence?.days_of_week?.split(',') || [],
  );
  const [daysOfMonth, setDaysOfMonth] = useState(
    schedule?.recurrence?.days_of_month || '',
  );
  const [monthsOfYear, setMonthsOfYear] = useState<string[]>(
    schedule?.recurrence?.months_of_year?.split(',') || [],
  );
  const [daysOfMonthArray, setDaysOfMonthArray] = useState<string[]>(
    schedule?.recurrence?.days_of_month?.split(',') || [],
  );
  const [startTimestamp, setStartTimestamp] = useState(
    schedule?.start_timestamp || '',
  );
  const [endTimestamp, setEndTimestamp] = useState(schedule?.end_timestamp || null);
  const [caseId, setCaseId] = useState<number | ''>(schedule?.case?.id || '');
  const [userId, setUserId] = useState<number | ''>(schedule?.user?.id || '');
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState<any>({});
  const [status, setStatus] = useState(schedule?.status || 'Active');

  const resetForm = () => {
    console.log('resetForm');
    setName('');
    setDescription('');
    setFrequency('OneTime');
    setInterval(1);
    setDaysOfWeek([]);
    setDaysOfMonth('');
    setMonthsOfYear([]);
    setDaysOfMonthArray([]);
    setStartTimestamp('');
    setEndTimestamp('');
    setCaseId('');
    setUserId('');
    setStatus('Active');
    setErrors({});
  };

  useEffect(() => {
    if (schedule) {
      setName(schedule.name);
      setDescription(schedule.description);
      setFrequency(schedule.recurrence?.frequency || 'OneTime');
      setInterval(schedule.recurrence?.interval || 1);
      setDaysOfWeek(schedule.recurrence?.days_of_week?.split(',') || []);
      setDaysOfMonth(schedule.recurrence?.days_of_month || '');
      setDaysOfMonthArray(schedule.recurrence?.days_of_month?.split(',') || []);
      setMonthsOfYear(schedule.recurrence?.months_of_year?.split(',') || []);
      setStartTimestamp(formatDatetimeLocal(schedule.start_timestamp));
      setEndTimestamp(
        schedule.end_timestamp
          ? formatDatetimeLocal(schedule.end_timestamp)
          : null,
      );
      setCaseId(schedule.case?.id || '');
      setUserId(schedule.user?.id || '');
      setStatus(schedule.status);
    } else {
      resetForm();
    }
  }, [schedule]);

  useEffect(() => {
    const fetchCasesAndUsers = async () => {
      try {
        const caseResponse = await caseApi.getList();
        const userResponse = await userApi.getUsers();
        setCases(caseResponse.data.cases);
        setUsers(userResponse.data);
      } catch (error) {
        console.error('Failed to fetch cases or users:', error);
      }
    };
    fetchCasesAndUsers();
  }, []);

  const validateFields = () => {
    const newErrors: any = {};
    if (!name) newErrors.name = 'Schedule name is required';
    if (!description) newErrors.description = 'Description is required';
    if (!startTimestamp) newErrors.startTimestamp = 'Start time is required';
    if (!userId) newErrors.userId = 'User is required';
    return newErrors;
  };

  const handleSave = async () => {
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const scheduleData = {
      name,
      description,
      start_timestamp: startTimestamp,
      end_timestamp: endTimestamp || null,
      case_id: caseId,
      user_id: userId,
      recurrence: {
        frequency,
        interval,
        days_of_week: daysOfWeek.join(','),
        days_of_month: daysOfMonth,
        months_of_year: monthsOfYear.join(','),
      },
      is_recurring: frequency !== 'OneTime',
      status,
    };
    try {
      if (schedule) {
        console.log('update schedule', scheduleData);
        await scheduleApi.update({ id: schedule.id, ...scheduleData });
      } else {
        await scheduleApi.add(scheduleData);
      }
      onSave();
      onHide();
    } catch (error) {
      toast.error('Failed to save schedule');
      console.error('Failed to save schedule:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {schedule ? 'Edit Schedule' : 'Add New Schedule'}
          </h2>
          <button
            onClick={onHide}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name and Description fields */}
            <div>
              <label
                htmlFor="scheduleName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Schedule Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="scheduleName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev: any) => ({ ...prev, name: '' }));
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="scheduleDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="scheduleDescription"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev: any) => ({ ...prev, description: '' }));
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Frequency selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="scheduleFrequency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Frequency <span className="text-red-500">*</span>
              </label>
              <select
                id="scheduleFrequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="OneTime">One Time</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {frequency !== 'OneTime' && (
              <div>
                <label
                  htmlFor="interval"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Interval
                </label>
                <input
                  disabled={frequency === 'OneTime'}
                  type="number"
                  id="interval"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
            )}
          </div>

          {/* Custom frequency options */}
          {frequency === 'Custom' && (
            <div className="space-y-6 bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CheckboxMultiSelect
                  options={[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ]}
                  value={daysOfWeek}
                  onChange={setDaysOfWeek}
                  label="Days of the Week"
                />
                <CheckboxMultiSelect
                  options={Array.from({ length: 31 }, (_, i) =>
                    (i + 1).toString(),
                  )}
                  value={daysOfMonthArray}
                  onChange={(newValue: any) => {
                    setDaysOfMonthArray(newValue);
                    setDaysOfMonth(newValue.join(','));
                  }}
                  label="Days of the Month"
                />
                <CheckboxMultiSelect
                  options={[
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ]}
                  value={monthsOfYear}
                  onChange={setMonthsOfYear}
                  label="Months of the Year"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startTimestamp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                id="startTimestamp"
                value={startTimestamp}
                onChange={(e) => {
                  setStartTimestamp(e.target.value);
                  setErrors((prev: any) => ({ ...prev, startTimestamp: '' }));
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
              {errors.startTimestamp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startTimestamp}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="endTimestamp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                End Time
              </label>
              <input
                type="datetime-local"
                id="endTimestamp"
                value={endTimestamp}
                onChange={(e) => setEndTimestamp(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="case"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Case
              </label>
              <select
                id="case"
                value={caseId}
                onChange={(e) => setCaseId(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select Case</option>
                {cases?.map((caseItem: any) => (
                  <option key={caseItem.id} value={caseItem.id}>
                    {caseItem.id}: {caseItem.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="user"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                For teacher <span className="text-red-500">*</span>
              </label>
              <select
                id="user"
                value={userId}
                onChange={(e) => {
                  setUserId(Number(e.target.value));
                  setErrors((prev: any) => ({ ...prev, userId: '' }));
                }}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select User</option>
                {users?.map((user: any) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
              )}
            </div>
          </div>
          {schedule && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onHide}
            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScheduleModal;
