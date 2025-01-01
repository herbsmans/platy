export interface DefaultQuestion {
  id: string;
  question: string;
  response_type: 'text' | 'procedures';
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: string;
  user_id: string;
  question_id: string;
  response: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionWithResponse extends DefaultQuestion {
  userResponse?: UserResponse;
}

export interface Procedure {
  id: string;
  name: string;
}