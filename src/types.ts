export type ById<T> = {
  [id: string]: T;
};

export type Question = {
  id: string;
  title: string;
  options: Option[];
  tags: Tag[];
};

export type Tag = string;

export type Option = {
  value: string;
  title: string;
};

export type Answer = Option["value"];

export type Rule = {
  // constraint: `id` must be globally unique
  id: string;
  description: string;
  // constraint: `if.questionId` must differ from `then.questionId`
  if: {
    questionId: Question["id"];
    matches: (answer: Answer) => boolean;
  };
  then: {
    questionId: Question["id"];
    mustMatch: (answer: Answer) => boolean;
  };
};
