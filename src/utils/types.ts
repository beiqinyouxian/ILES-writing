export type AppLesson = {
  id: string;
  title: string;
  summary: string;
  status: 'available' | 'coming';
  parts: {
    id: string;
    title: string;
    keypoints: string[];
    tags?: string[];
  }[];
  exercises: PracticeExercise[];
  tips: TipCard[];
};

export type PracticeExercise = {
  id: string;
  title: string;
  instruction: string;
  tags: string[];
  blocks: {
    items: (PracticeText | PracticeBlank)[];
  }[];
};

export type PracticeText = {
  type: 'text';
  text: string;
};

export type PracticeBlank = {
  type: 'blank';
  id: string;
  answer: string;
  focusTag?: string;
};

export type TipCard = {
  id: string;
  title: string;
  content: string;
  tags: string[]; // e.g., ['trend', 'overview', 'intro', 'agree', 'graph-dynamic']
  examples?: string[];
};

