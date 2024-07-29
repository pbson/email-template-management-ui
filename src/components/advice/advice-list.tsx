import React from 'react';
import AdviceItem from './advice-item';

interface AdviceListProps {
  advices: any;
  onAdviceSelect: (id: number, selected: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, content: string) => void;
  onEditorChange: any;
}

const AdviceList: React.FC<AdviceListProps> = ({
  advices,
  onAdviceSelect,
  onDelete,
  onUpdate,
  onEditorChange,
}) => {
  if (!advices || advices.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No advices found.</div>
    );
  }

  return (
    <div>
      {advices.map((adviceItem: any) => (
        <AdviceItem
          key={adviceItem.id}
          adviceItem={adviceItem}
          onSelect={onAdviceSelect}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEditorChange={onEditorChange}
        />
      ))}
    </div>
  );
};

export default AdviceList;
