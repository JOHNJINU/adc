export interface AuthUser {
  fullName: string;
  email: string;
  role: 'Admin' | 'Student';
}

export interface QuestionListItem {
  id: number;
  questionCode: string;
  cluster?: string | null;
  discipline: string;
  topic: string;
  difficulty: string;
  scenarioText?: string | null;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string | null;
  imageUrl?: string | null;
  isBookmarked: boolean;
  alreadyAttempted: boolean;
}

export interface AnswerResult {
  isCorrect: boolean;
  correctOption: string;
  explanationCorrect: string;
  explanationWrong?: Record<string, string> | null;
  clinicalPearl?: string | null;
  references?: string | null;
}

export interface DashboardStats {
  questionsSolved: number;
  accuracyPercent: number;
  questionsToReview: number;
  mockExamsTaken: number;
  topicBreakdown: { topic: string; attempted: number; accuracyPercent: number }[];
}

export interface MistakeTopic {
  topic: string;
  wrongCount: number;
  accuracyPercent: number;
}

export interface MockExamListItem {
  id: number;
  title: string;
  timeLimitMinutes: number;
  questionCount: number;
}

export interface QuestionAdmin {
  id?: number;
  questionCode: string;
  cluster?: string;
  discipline: string;
  topic: string;
  difficulty: string;
  scenarioText?: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  optionE?: string;
  correctOption: string;
  explanationCorrect: string;
  explanationWrong?: Record<string, string>;
  clinicalPearl?: string;
  references?: string;
  imageUrl?: string;
  status: string;
}

export interface AdminMockExamListItem {
  id: number;
  title: string;
  timeLimitMinutes: number;
  status: string;
  questionCount: number;
  createdAt: string;
}

export interface QuestionPickerItem {
  id: number;
  questionCode: string;
  discipline: string;
  topic: string;
  difficulty: string;
  status: string;
}

export interface AdminMockExamDetail {
  id: number;
  title: string;
  timeLimitMinutes: number;
  status: string;
  questions: { questionId: number; questionCode: string; discipline: string; topic: string; orderIndex: number }[];
}

export interface StudentListItem {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  questionsSolved: number;
  accuracyPercent: number;
  mockExamsTaken: number;
}

export interface StudentDetail {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  questionsSolved: number;
  accuracyPercent: number;
  recentAnswers: {
    questionId: number; questionCode: string; topic: string;
    selectedOption: string; isCorrect: boolean; answeredAt: string;
  }[];
  mockAttempts: {
    attemptId: number; mockExamTitle: string; startedAt: string;
    completedAt: string | null; scorePercent: number | null;
  }[];
}
