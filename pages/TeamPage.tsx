import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { TeamMemberForm } from '../components/team/TeamMemberForm';
import { TeamMemberList } from '../components/team/TeamMemberList';
import { SchedulingSystemSelect } from '../components/team/SchedulingSystemSelect';
import type { SchedulingSystem, TeamMember } from '../types/team';

export function TeamPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<SchedulingSystem | null>(null);
  const [systems, setSystems] = useState<SchedulingSystem[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const { userData, loading: userLoading } = useUser();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userData?.scheduling_system && systems.length > 0) {
      const userSystem = systems.find(s => s.name === userData.scheduling_system);
      setSelectedSystem(userSystem || null);
    }
  }, [userData?.scheduling_system, systems]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const { data: systemsData, error: systemsError } = await supabase
        .from('scheduling_systems')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (systemsError) throw systemsError;
      setSystems(systemsData || []);

      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (membersError) throw membersError;
      setMembers(membersData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este dentista?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir dentista');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  if (loading || userLoading) {
    return (
      <div className="flex justify-center p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Gerenciamento de Dentistas</h1>

      {/* Sistema de Agendamento */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sistema de Agendamento</h2>
        <SchedulingSystemSelect
          systems={systems}
          selectedSystem={selectedSystem}
          onSystemSelect={setSelectedSystem}
        />
      </div>

      {/* Membros da Equipe */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Membros da Equipe</h2>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Adicionar Dentista
            </button>
          </div>

          <TeamMemberList
            schedulingSystem={selectedSystem}
            members={members}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="Nenhum dentista encontrado. Adicione seu primeiro membro da equipe!"
          />
        </div>
      </div>

      {/* Modal de Adicionar/Editar Dentista */}
      {showForm && (
        <TeamMemberForm
          schedulingSystem={selectedSystem}
          initialData={editingMember}
          onClose={handleCloseForm}
          onSuccess={() => {
            handleCloseForm();
            loadData();
          }}
        />
      )}
    </div>
  );
}