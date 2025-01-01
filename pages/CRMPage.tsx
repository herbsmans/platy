import React from 'react';
import { KanbanBoard } from '../components/crm/KanbanBoard';

export function CRMPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">CRM</h1>
      <KanbanBoard />
    </div>
  );
}