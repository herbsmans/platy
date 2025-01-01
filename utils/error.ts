export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const { message, details, hint } = error as { message?: string; details?: string; hint?: string };
    return message || details || hint || 'Erro desconhecido';
  }

  return 'Erro desconhecido';
}

export function handleSupabaseError(error: unknown): string {
  console.error('Erro Supabase:', error);
  return formatError(error);
}