export interface TextQuestion {
  id: number;
  question: string;
  sampleAnswer1: string;
  sampleAnswer2: string;
  questionAudioPath: string;
  answer1AudioPath: string;
  answer2AudioPath: string;
  categoryId: number;
}

export interface IeltsCategory {
  id: number;
  categoryName: string;
  description: string;
  totalQuestions: number;
  completedQuestions: number;
}

export interface IeltsCategoryResponse {
  data: IeltsCategory[];
} 