import React from 'react';
import { WhatsAppSettings } from '../components/settings/WhatsAppSettings';
import { DentistSettings } from '../components/settings/DentistSettings';
import { FollowupSettings } from '../components/training/FollowupSettings';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
      
      <div className="grid gap-6">
        <DentistSettings />
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configurações de Follow-up</h2>
          <FollowupSettings />
        </div>
        <WhatsAppSettings />
      </div>
    </div>
  );
}