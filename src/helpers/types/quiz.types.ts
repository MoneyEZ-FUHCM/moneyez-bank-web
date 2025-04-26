export interface AnswerOption {
  content: string;
}

export interface Question {
  content: string;
  answerOptions: AnswerOption[];
}

export interface Quiz {
  title: string;
  description: string;
  status: number;
  questions: Question[];
}
