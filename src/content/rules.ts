import { Rule, Answer } from "../types";
import { keyBy } from "lodash";

const modusPonens: Rule[] = [
  {
    id: "1",
    description: "components with local state are functions or classes",
    if: {
      questionId: "local-state",
      matches: answer => answer !== "none"
    },
    then: {
      questionId: "component-type",
      mustMatch: answer => answer === "function" || answer === "class"
    }
  },

  {
    id: "2",
    description: "components with local state via classes are classes",
    if: {
      questionId: "local-state",
      matches: answer => answer === "class"
    },
    then: {
      questionId: "component-type",
      mustMatch: answer => answer === "class"
    }
  },

  {
    id: "3",
    description: "components with local state via hooks are functions",
    if: {
      questionId: "local-state",
      matches: answer =>
        answer === "usestate-hook" || answer === "usereducer-hook"
    },
    then: {
      questionId: "component-type",
      mustMatch: answer => answer === "function"
    }
  },

  {
    id: "4",
    description: "components with function definitions are functions",
    if: {
      questionId: "function-definition",
      matches: answer => answer !== "none"
    },
    then: {
      questionId: "component-type",
      mustMatch: answer => answer === "function"
    }
  },

  {
    id: "5",
    description: "function components have function definitions",
    if: {
      questionId: "component-type",
      matches: answer => answer === "function"
    },
    then: {
      questionId: "function-definition",
      mustMatch: answer => answer !== "none"
    }
  },

  {
    id: "6",
    description:
      "components with useReducer initialization have useReducer state",
    if: {
      questionId: "usereducer-hook-init",
      matches: answer => answer !== "none"
    },
    then: {
      questionId: "local-state",
      mustMatch: answer => answer === "usereducer-hook"
    }
  },

  {
    id: "7",
    description:
      "components with useReducer local state have useReducer initialization",
    if: {
      questionId: "local-state",
      matches: answer => answer === "usereducer-hook"
    },
    then: {
      questionId: "usereducer-hook-init",
      mustMatch: answer => answer !== "none"
    }
  },

  {
    id: "8",
    description: "components with class callback binding are classes",
    if: {
      questionId: "class-callback-binding",
      matches: answer => answer !== "none"
    },
    then: {
      questionId: "component-type",
      mustMatch: answer => answer === "class"
    }
  },

  {
    id: "9",
    description: "class components have callback binding",
    if: {
      questionId: "component-type",
      matches: answer => answer === "class"
    },
    then: {
      questionId: "class-callback-binding",
      mustMatch: answer => answer !== "none"
    }
  }
];

const modusTollens: Rule[] = modusPonens.map(rule => ({
  id: "i_" + rule.id,
  description: "...",
  if: {
    questionId: rule.then.questionId,
    // type checker complains when type for `answer` isn't specified... why?!
    matches: (answer: Answer) => !rule.then.mustMatch(answer)
  },
  then: {
    questionId: rule.if.questionId,
    mustMatch: (answer: Answer) => !rule.if.matches(answer)
  }
}));

export const rules = keyBy([...modusPonens, ...modusTollens], rule => rule.id);
