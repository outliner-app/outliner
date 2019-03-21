import { Question, ById } from "../types";
import { keyBy } from "lodash";

export const questions: ById<Question> = keyBy(
  [
    {
      id: "component-type",
      title: "type of component",
      options: [
        { value: "class", title: "class" },
        { value: "function", title: "function" },
        { value: "styled-component", title: "styled-component" }
      ],
      tags: []
    },

    {
      id: "local-state",
      title: "local state",
      options: [
        { value: "none", title: "none" },
        { value: "class", title: "class" },
        { value: "usestate-hook", title: "useState hook" },
        { value: "usereducer-hook", title: "useReducer hook" }
      ],
      tags: []
    },

    {
      id: "usereducer-hook-init",
      title: "useReducer hook initialization",
      options: [
        { value: "none", title: "none" },
        { value: "second-argument", title: "initial state as second argument" },
        { value: "lazy", title: "lazy initialization" }
      ],
      tags: []
    },

    {
      id: "function-definition",
      title: "function definition type",
      options: [
        { value: "none", title: "none" },
        { value: "statement", title: "statement" },
        { value: "expression", title: "expression" },
        { value: "arrow-function", title: "arrow function" }
      ],
      tags: []
    },

    {
      id: "class-callback-binding",
      title: "class callback binding",
      options: [
        { value: "none", title: "none" },
        { value: "manual", title: "manual binding" },
        { value: "class-fields-syntax", title: "class fields syntax" },
        { value: "arrow-function", title: "arrow function in render" }
      ],
      tags: []
    }
  ],
  question => question.id
);
