import React from 'react';

import CaseItem from './case-item';

interface CaseListProps {
  cases: any;
  onCaseSelect: (id: number, selected: boolean) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, content: string) => void;
  onEditorChange: any;
  tags: any;
}

const CaseList: React.FC<CaseListProps> = ({
  cases,
  onCaseSelect,
  onDelete,
  onUpdate,
  onEditorChange,
  tags,
}) => {
  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No cases found.</div>
    );
  }

  return (
    <div>
      {cases.map((caseItem: any) => (
        <CaseItem
          key={caseItem.id}
          caseItem={caseItem}
          onSelect={onCaseSelect}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onEditorChange={onEditorChange}
          tags={tags}
        />
      ))}
    </div>
  );
};

export default CaseList;
