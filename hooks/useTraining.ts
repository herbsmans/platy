import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { notifyTrainingUpdate } from '../services/webhook/training';
import type { DefaultQuestion, UserResponse, QuestionWithResponse } from '../types/training';

export function useTraining() {
  const [questions, setQuestions] = useState<QuestionWithResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Map<string, string>>(new Map());

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: questionsData, error: questionsError } = await supabase
        .from('default_questions')
        .select('*')
        .order('created_at');

      if (questionsError) throw questionsError;

      const { data: responsesData, error: responsesError } = await supabase
        .from('user_responses')
        .select('*')
        .eq('user_id', user.id);

      if (responsesError) throw responsesError;

      const questionsWithResponses = questionsData.map((question: DefaultQuestion) => ({
        ...question,
        userResponse: responsesData.find((response: UserResponse) => 
          response.question_id === question.id
        ),
      }));

      setQuestions(questionsWithResponses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const saveResponses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const responsesToSave = Array.from(responses.entries()).map(([questionId, response]) => ({
        user_id: user.id,
        question_id: questionId,
        response: response,
      }));

      const { error } = await supabase
        .from('user_responses')
        .upsert(
          responsesToSave,
          { onConflict: 'user_id,question_id' }
        );

      if (error) throw error;

      // Notify webhook after successful save
      await notifyTrainingUpdate(user.id);
      
      await loadQuestions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error saving responses');
    }
  };

  const updateResponse = (questionId: string, response: string) => {
    setResponses(prev => new Map(prev).set(questionId, response));
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    saveResponses,
    updateResponse,
  };
}