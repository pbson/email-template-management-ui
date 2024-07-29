import { useState, useEffect } from 'react';
import {
  Grid,
  Calendar,
  Tag,
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash,
  LogOut,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import tagApi from '@/features/tag/tag.api';
import AddTagModal from '@/components/tag/add-tag-modal';
import logo from '@/assets/logo.svg';

const SidebarComponent = () => {
  const [isTagsOpen, setIsTagsOpen] = useState(true);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [tags, setTags] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tagToEdit, setTagToEdit] = useState<{
    id: number;
    name: string;
    color: string;
  } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await tagApi.getList();
        setTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('jwt'); // Clear the JWT
    navigate('/email-template-management-ui/login'); // Redirect to the login page
  };

  const handleSaveTag = () => {
    const fetchTags = async () => {
      try {
        const response = await tagApi.getList();
        setTags(response.data);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await tagApi.delete(id);
      setTags(tags.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  return (
    <div className="bg-white w-72 min-h-screen flex flex-col border-r border-gray-200">
      <div className="p-4 flex justify-center items-center">
        <img src={logo} alt="Logo" className="h-8" />
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <Link
          to="/case-management"
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-150 ease-in-out ${
            isActive('/case-management')
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Grid className="mr-3 h-5 w-5" />
          Case Management
        </Link>
        <Link
          to="/schedule-management"
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-150 ease-in-out ${
            isActive('/schedule-management')
              ? 'text-blue-600 bg-blue-50'
              : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Calendar className="mr-3 h-5 w-5" />
          Schedule Management
        </Link>
        <div>
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 ease-in-out"
          >
            <span className="flex items-center">
              <Tag className="mr-3 h-5 w-5" />
              Tags
            </span>
            {isTagsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isTagsOpen && (
            <div className="mt-2 space-y-1">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors duration-150 ease-in-out ${
                    hoveredTag === tag.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onMouseEnter={() => setHoveredTag(tag.id)}
                  onMouseLeave={() => setHoveredTag(null)}
                >
                  <span className="flex items-center">
                    <span
                      className={`w-2 h-2 rounded-full mr-2`}
                      style={{ backgroundColor: tag.color }}
                    ></span>
                    {tag.name}
                  </span>
                  {hoveredTag === tag.id && (
                    <div className="flex space-x-1">
                      <button
                        className="text-gray-400 hover:text-blue-600"
                        onClick={() => {
                          setTagToEdit(tag);
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleDeleteTag(tag.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              <button
                onClick={() => {
                  setTagToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center w-full px-4 py-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150 ease-in-out"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="mt-auto p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 ease-in-out"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
      {isAddModalOpen && (
        <AddTagModal
          show={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveTag}
          tagToEdit={tagToEdit}
        />
      )}
    </div>
  );
};

export default SidebarComponent;
