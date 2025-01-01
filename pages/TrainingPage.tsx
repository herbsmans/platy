import React, { useState } from 'react';
import { useTraining } from '../hooks/useTraining';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { QuestionList } from '../components/training/QuestionList';

export function TrainingPage() {
  const { questions, loading, error, saveResponses, updateResponse } = useTraining();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      await saveResponses();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar respostas');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Informações da Clínica</h1>
      
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600 mb-6">
            Por favor, preencha as informações abaixo sobre sua clínica odontológica. 
            Estas informações são importantes para melhor atendimento aos seus pacientes.
          </p>
          
          <QuestionList 
            questions={questions} 
            onResponseChange={updateResponse}
          />

          {saveError && (
            <div className="mt-4 p-4 text-red-600 bg-red-50 rounded-lg">
              {saveError}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Todas as Respostas'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}