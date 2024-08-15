import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Edit, Trash, Lock } from 'lucide-react';
import AddVariableModal from './add-variable';
import variableApi from '@/features/variable/variable.api';

interface Variable {
  id: number;
  name: string;
  default_value: string;
  is_permanent: boolean;
}

interface VariableSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVariable: (variable: string) => void;
}

const VariableSelector: React.FC<VariableSelectorProps> = ({
  isOpen,
  onClose,
  onSelectVariable,
}) => {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(
    null,
  );
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const response = await variableApi.getList();
        console.log(response.data);
        setVariables(response.data);
      } catch (error) {
        console.error('Failed to fetch variables:', error);
      }
    };

    fetchVariables();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest('.modal-content')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const filteredVariables = variables.filter((variable) =>
    variable.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddVariable = async (
    name: string,
    defaultValue: string,
    isPermanent: boolean,
  ) => {
    try {
      const response = await variableApi.create(
        name,
        defaultValue,
        isPermanent,
      );
      setVariables([...variables, response.data]);
    } catch (error) {
      console.error('Failed to add variable:', error);
    }
  };

  const handleEditVariable = async (
    name: string,
    defaultValue: string,
    isPermanent: boolean,
  ) => {
    if (selectedVariable) {
      try {
        const response = await variableApi.update(selectedVariable.id, {
          name,
          default_value: defaultValue,
          is_permanent: isPermanent,
        });
        setVariables(
          variables.map((v) =>
            v.id === selectedVariable.id ? response.data : v,
          ),
        );
        setSelectedVariable(null);
      } catch (error) {
        console.error('Failed to update variable:', error);
      }
    }
  };

  const handleDeleteVariable = async () => {
    if (selectedVariable) {
      try {
        await variableApi.delete(Number(selectedVariable.id));
        setVariables(variables.filter((v) => v.id !== selectedVariable.id));
        setSelectedVariable(null);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Failed to delete variable:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full modal-content"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Insert Variable</h2>
            <p className="text-sm text-gray-500">
              Click the variable to insert
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search variables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <div className="max-h-60 overflow-y-auto mb-4">
          {filteredVariables.map((variable) => (
            <div
              key={variable.id}
              className="flex items-center justify-between py-2 px-3 hover:bg-gray-100 rounded-md"
            >
              <button
                onClick={() => {
                  !variable.is_permanent
                    ? onSelectVariable(`${variable.name}`)
                    : onSelectVariable(`${variable.name}::${variable.default_value}`);
                }}
                className="text-left flex-grow flex items-center"
              >
                <div className="font-medium">
                  {variable.name.replace(/_/g, ' ')}
                </div>
                {variable.is_permanent && (
                  <Lock size={16} className="ml-2 text-gray-500" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariable(variable);
                    setIsAddModalOpen(true);
                  }}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariable(variable);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Add Variable
        </button>
      </div>

      {isAddModalOpen && (
        <AddVariableModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setSelectedVariable(null);
          }}
          onSave={selectedVariable ? handleEditVariable : handleAddVariable}
          initialName={selectedVariable?.name}
          initialDefaultValue={selectedVariable?.default_value}
          initialIsPermanent={selectedVariable?.is_permanent}
        />
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              Are you sure you want to delete the variable "
              {selectedVariable?.name}"?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVariable}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VariableSelector;
