// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { ById, Answer } from "../types";
import React from "react";

type Props = {
  providedAnswers: ById<Answer>;
  inferredAnswers: ById<Answer>;
};

export const Code: React.FunctionComponent<Props> = ({
  providedAnswers,
  inferredAnswers
}) => {
  return (
    <SyntaxHighlighter language="javascript">
      {`
// provided answers
${JSON.stringify(providedAnswers, null, 2)}

// inferred answers
${JSON.stringify(inferredAnswers, null, 2)}

// todo: generate code from answers
`.trim()}
    </SyntaxHighlighter>
  );
};
