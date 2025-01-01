import React from 'react';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { ContactStatusChart } from '../components/dashboard/ContactStatusChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Painel</h1>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContactStatusChart />
        <RecentActivity />
      </div>
    </div>
  );
}