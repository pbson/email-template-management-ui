import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

import adviceApi from '@/features/advice/advice.api';
import toast from 'react-hot-toast';
import AddAdviceModal from '@/components/advice/add-advice-modal';
import AdviceList from '@/components/advice/advice-list';
import Pagination from '@/components/common/pagination';

interface Advice {
  id: number;
  title: string;
  selected: boolean;
  content?: string;
}

interface AdviceListResponse {
  advices: Advice[];
  total: number;
  page: number;
  limit: number;
}

const ADVICES_PER_PAGE = 5;

const AdviceManagement: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [loadingAdvices, setLoadingAdvices] = useState(false);
  const [advicesData, setAdvicesData] = useState<AdviceListResponse | null>(
    null,
  );
  const [currentCase, setCase] = useState<any>(null);

  const fetchAdvices = useCallback(async () => {
    setLoadingAdvices(true);
    try {
      const response = await adviceApi.getList(caseId as any, {
        title: searchTitle,
        page: currentPage,
        limit: ADVICES_PER_PAGE,
      });
      setAdvicesData(response.data);
      setAdvices(
        response.data.advices.map((adviceItem: any) => ({
          ...adviceItem,
          selected: false,
        })),
      );
      setCase(response.data.case);
    } catch (error) {
      console.error('Failed to fetch advices:', error);
    } finally {
      setLoadingAdvices(false);
    }
  }, [searchTitle, currentPage, caseId]);

  useEffect(() => {
    fetchAdvices();
  }, [fetchAdvices]);

  const handleAddNewAdvice = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    fetchAdvices();
  };

  const handleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);
    setAdvices(advices.map((a) => ({ ...a, selected: newAllSelected })));
  };

  const handleAdviceSelect = (id: number, selected: boolean) => {
    setAdvices(advices.map((a) => (a.id === id ? { ...a, selected } : a)));
    setAllSelected(advices.every((a) => a.selected));
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

  const handleDeleteSelect = async () => {
    const idsToDelete = advices.filter((a) => a.selected).map((a) => a.id);
    for (const id of idsToDelete) {
      try {
        await adviceApi.delete(id.toString());
      } catch (error) {
        console.error(`Failed to delete advice ${id}:`, error);
      }
    }
    fetchAdvices();
    toast.success('Delete Selected Advices successfully');
  };

  const handleDeleteAdvice = async (id: number) => {
    try {
      await adviceApi.delete(id.toString());
      fetchAdvices();
    } catch (error) {
      console.error(`Failed to delete advice ${id}:`, error);
      alert('Failed to delete advice');
    } finally {
      toast.success('Delete Advice successfully');
    }
  };

  const handleUpdateAdvice = async (
    id: number,
    title: string,
    content: string,
  ) => {
    try {
      await adviceApi.update({ id, title, content });
    } catch (error) {
      console.error(`Failed to update advice ${id}:`, error);
      alert('Failed to update advice');
    } finally {
      toast.success('Update Advice successfully');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Advice for Case: {currentCase?.title}
        </h1>

        <div className="mb-6">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={allSelected}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 transition-all duration-150 ease-in-out"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
              <button
                onClick={handleDeleteSelect}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center space-x-2 text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={handleAddNewAdvice}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center space-x-2 text-sm font-medium"
              >
                <Plus size={16} />
                <span>Add New Advice</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                onChange={handleSearch}
                placeholder="Search advices..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 ease-in-out"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {loadingAdvices && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loadingAdvices && advices.length === 0 && (
          <div className="flex justify-center">
            <p>No advices found.</p>
          </div>
        )}

        {!loadingAdvices && advices.length > 0 && (
          <AdviceList
            advices={advices}
            onAdviceSelect={handleAdviceSelect}
            onDelete={handleDeleteAdvice}
            onUpdate={handleUpdateAdvice}
            onEditorChange={fetchAdvices}
          />
        )}

        {advicesData && (
          <Pagination
            total={advicesData.total}
            page={advicesData.page}
            limit={advicesData.limit}
            onPageChange={handlePageChange}
          />
        )}

        <AddAdviceModal
          caseId={Number(caseId)}
          show={showModal}
          onHide={handleModalClose}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
};

export default AdviceManagement;
