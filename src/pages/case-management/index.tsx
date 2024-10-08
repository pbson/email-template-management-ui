import React, { useState, useEffect, useCallback } from 'react';

import { debounce } from 'lodash';
import { Plus, Search, Trash2 } from 'lucide-react';

import caseApi from '@/features/case/services/case.api';
import tagApi from '@/features/tag/tag.api';
import toast from 'react-hot-toast';
import AddCaseModal from '@/components/case/add-case-modal';
import CaseList from '@/components/case/case-list';
import Pagination from '@/components/common/pagination';
import confirm from '@/components/common/confirm';

interface Case {
  id: number;
  title: string;
  tags: { id: number; name: string; color: string }[];
  selected: boolean;
  content?: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
}

interface CaseListResponse {
  cases: Case[];
  total: number;
  page: number;
  limit: number;
}

const CASES_PER_PAGE = 5;

const CaseManagement: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [loadingCases, setLoadingCases] = useState(false);
  const [, setLoadingTags] = useState(false);
  const [casesData, setCasesData] = useState<CaseListResponse | null>(null);

  const fetchCases = useCallback(async () => {
    setLoadingCases(true);
    try {
      const response = await caseApi.getList({
        title: searchTitle,
        tagId: selectedTagId,
        page: currentPage,
        limit: CASES_PER_PAGE,
      });
      setCasesData(response.data);
      setCases(
        response.data.cases.map((caseItem: any) => ({
          ...caseItem,
          tag: caseItem.tags[0],
          selected: false,
        })),
      );
    } catch (error) {
      console.error('Failed to fetch cases:', error);
    } finally {
      setLoadingCases(false);
    }
  }, [searchTitle, selectedTagId, currentPage]);

  const fetchTags = useCallback(async () => {
    setLoadingTags(true);
    try {
      const response = await tagApi.getList();
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoadingTags(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleAddNewCase = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalSave = () => {
    fetchCases();
  };

  const handleSelectAll = () => {
    const newAllSelected = !allSelected;
    setAllSelected(newAllSelected);
    setCases(cases.map((c) => ({ ...c, selected: newAllSelected })));
  };

  const handleCaseSelect = (id: number, selected: boolean) => {
    setCases(cases.map((c) => (c.id === id ? { ...c, selected } : c)));
    setAllSelected(cases.every((c) => c.selected));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tagId = event.target.value ? Number(event.target.value) : undefined;
    setSelectedTagId(tagId);
    setCurrentPage(1);
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
    const casesToDelete = cases.filter((c) => c.selected);
    const idsToDelete = casesToDelete.map((c) => c.id);

    if (idsToDelete.length === 0) {
      toast.error('Please select at least one to delete');
      return;
    }

    const confirmation = await confirm({
      title: 'Delete Selected Cases',
      message: `Are you sure you want to delete ${idsToDelete.length} selected case(s)? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });

    if (confirmation) {
      let successCount = 0;
      let failCount = 0;

      for (const id of idsToDelete) {
        try {
          await caseApi.delete(id.toString());
          successCount++;
        } catch (error) {
          console.error(`Failed to delete case ${id}:`, error);
          failCount++;
        }
      }

      await fetchCases();

      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} case(s)`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} case(s)`);
      }
    } else {
      return;
    }
  };

  const handleDeleteCase = async (id: number) => {
    try {
      await caseApi.delete(id.toString());
      fetchCases();
    } catch (error) {
      console.error(`Failed to delete case ${id}:`, error);
      alert('Failed to delete case');
    } finally {
      void toast.success('Delete Case successfully');
    }
  };

  const handleUpdateCase = async (
    id: number,
    title: string,
    content: string,
    tagId?: number,
  ) => {
    try {
      await caseApi.update({ id, title, content, tagId });
    } catch (error) {
      console.error(`Failed to update case ${id}:`, error);
      alert('Failed to update case');
    } finally {
      void toast.success('Update Case successfully');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Case Management
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
                onClick={handleAddNewCase}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150 ease-in-out flex items-center space-x-2 text-sm font-medium"
              >
                <Plus size={16} />
                <span>Add New Case</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  onChange={handleSearch}
                  placeholder="Search cases..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 ease-in-out"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedTagId || ''}
                  onChange={handleTagSelect}
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-8 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 ease-in-out text-sm"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
                {selectedTagId && (
                  <div
                    style={{
                      backgroundColor: tags.find((t) => t.id === selectedTagId)
                        ?.color,
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full"
                  ></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {loadingCases && (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        )}

        {!loadingCases && cases.length === 0 && (
          <div className="flex justify-center">
            <p>No cases found.</p>
          </div>
        )}

        {!loadingCases && cases.length > 0 && (
          <CaseList
            cases={cases}
            onEditorChange={fetchCases}
            onCaseSelect={handleCaseSelect}
            onDelete={handleDeleteCase}
            onUpdate={handleUpdateCase}
            tags={tags}
          />
        )}

        {casesData && (
          <Pagination
            total={casesData.total}
            page={casesData.page}
            limit={casesData.limit}
            onPageChange={handlePageChange}
          />
        )}

        <AddCaseModal
          show={showModal}
          onHide={handleModalClose}
          // tags={tags}
          onSave={handleModalSave}
        />
      </div>
    </div>
  );
};

export default CaseManagement;
