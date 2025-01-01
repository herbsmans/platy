import React from 'react';
import { ContactList } from '../components/ContactList';

export function ContactsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Contacts</h1>
      <ContactList />
    </div>
  );
}