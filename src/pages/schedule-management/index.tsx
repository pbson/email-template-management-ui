import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Plus, Search } from 'lucide-react';
import scheduleApi from '@/features/schedule/schedule.api';
import toast from 'react-hot-toast';
import AddScheduleModal from '@/components/schedule/add-schedule-modal';
import ScheduleList from '@/components/schedule/schedule-list';
import Pagination from '@/components/common/pagination';
import { handleExportSchedule } from '@/utils/ical';
import { confirm } from '@/components/common/confirm';

const SCHEDULES_PER_PAGE = 5;

const ScheduleManagement: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [schedulesData, setSchedulesData] = useState<any | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);

  const fetchSchedules = useCallback(async () => {
    setLoadingSchedules(true);
    try {
      const response = await scheduleApi.getList({
        search: searchTitle,
        page: currentPage,
        limit: SCHEDULES_PER_PAGE,
      });
      setSchedulesData(response.data);
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setLoadingSchedules(false);
    }
  }, [searchTitle, currentPage]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleAddNewSchedule = () => {
    setEditingSchedule(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setEditingSchedule(null);
    setShowModal(false);
  };

  const handleModalSave = () => {
    fetchSchedules();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchTitle(query);
      setCurrentPage(1);
    }, 500),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleDeleteSchedule = async (id: number) => {
    const confirmation = await confirm({
      title: 'Delete Schedule',
      message: 'Are you sure you want to delete this schedule? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  
    if (confirmation) {
      try {
        await scheduleApi.delete(id);
        await fetchSchedules();
        toast.success('Schedule deleted successfully');
      } catch (error) {
        console.error(`Failed to delete schedule ${id}:`, error);
        toast.error('Failed to delete schedule');
      }
    } else {
      return;
    }
  };

  const handleEditSchedule = (schedule: any) => {
    setEditingSchedule(schedule);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Schedule Management
        </h1>

        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddNewSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center space-x-2 text-sm font-medium"
              >
                <Plus size={16} />
                <span>Add New Schedule</span>
              </button>
              <div className="relative">
                <input
                  type="text"
                  onChange={handleSearch}
                  placeholder="Search schedules..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 ease-in-out"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {loadingSchedules && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loadingSchedules && schedules.length === 0 && (
          <div className="flex justify-center">
            <p>No schedules found.</p>
          </div>
        )}

        {!loadingSchedules && schedules.length > 0 && (
          <ScheduleList
            schedules={schedules}
            onDelete={handleDeleteSchedule}
            onEdit={handleEditSchedule}
            onExport={handleExportSchedule}
          />
        )}

        {schedulesData && (
          <Pagination
            total={schedulesData.total}
            page={schedulesData.page}
            limit={schedulesData.limit}
            onPageChange={handlePageChange}
          />
        )}

        <AddScheduleModal
          show={showModal}
          onHide={handleModalClose}
          onSave={handleModalSave}
          schedule={editingSchedule}
        />
      </div>
    </div>
  );
};

export default ScheduleManagement;
