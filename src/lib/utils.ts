import { filter, keyBy, keys, values, mapValues, difference } from "lodash";
import { ById, Answer, Question, Rule, Option } from "../types";

export const inferAnswers = (
  questions: ById<Question>,
  providedAnswers: ById<Answer>,
  rules: ById<Rule>,
  prevInferredAnswers: ById<Answer> = {}
): ById<Answer> => {
  const providedAndPrevInferredAnswers = {
    ...providedAnswers,
    ...prevInferredAnswers
  };

  const applicableRulesForProvidedAnswers = getApplicableRulesForProvidedAnswers(
    providedAndPrevInferredAnswers,
    rules
  );

  const unansweredQuestionsById = keyBy(
    filter(
      questions,
      question => !isAnswered(question.id, providedAndPrevInferredAnswers)
    ),
    question => question.id
  );

  const validAnswersByQuestionId = mapValues(
    unansweredQuestionsById,
    question =>
      getValidAnswers(question, applicableRulesForProvidedAnswers).map(
        option => option.value
      )
  );

  const applicableRulesForAllValidAnswers = keyBy(
    filter(
      rules,
      rule =>
        rule.if.questionId in validAnswersByQuestionId &&
        validAnswersByQuestionId[rule.if.questionId].every(answer =>
          rule.if.matches(answer)
        )
    ),
    rule => rule.id
  );

  const questionsWithOneValidAnswerLeft = filter(
    unansweredQuestionsById,
    question =>
      getValidAnswers(question, {
        ...applicableRulesForProvidedAnswers,
        ...applicableRulesForAllValidAnswers
      }).length === 1
  );

  const inferredAnswers = mapValues(
    keyBy(questionsWithOneValidAnswerLeft, question => question.id),
    question =>
      getValidAnswers(question, {
        ...applicableRulesForProvidedAnswers,
        ...applicableRulesForAllValidAnswers
      })[0].value
  );

  if (
    keys({ ...providedAndPrevInferredAnswers, ...inferredAnswers }).length ===
    keys(providedAndPrevInferredAnswers).length
  ) {
    return prevInferredAnswers;
  }

  return inferAnswers(questions, providedAnswers, rules, {
    ...prevInferredAnswers,
    ...inferredAnswers
  });
};

export const getValidAnswers = (
  question: Question,
  applicableRules: ById<Rule>
): Option[] =>
  question.options.filter(option =>
    values(applicableRules).every(
      rule =>
        rule.then.questionId !== question.id ||
        rule.then.mustMatch(option.value)
    )
  );

export const getInvalidAnswers = (
  question: Question,
  applicableRules: ById<Rule>
): Option[] =>
  difference(question.options, getValidAnswers(question, applicableRules));

/**
 * Only finds 'direct conflicts'. Doesn't work for something like this:
 *
 * "component-type": "class",
 * "uses-special-setstate-hook-technique": "yes"
 */
export const findConflicts = (
  answers: ById<Answer>,
  applicableRules: ById<Rule>
): ById<Rule> => {
  const conflicts = filter(
    applicableRules,
    rule =>
      isAnswered(rule.then.questionId, answers) &&
      !rule.then.mustMatch(answers[rule.then.questionId])
  );

  return keyBy(conflicts, rule => rule.id);
};

/**
 * Determines which rules are in force, given a collection of answers
 * and rules.
 */
export const getApplicableRulesForProvidedAnswers = (
  answers: ById<Answer>,
  rules: ById<Rule>
): ById<Rule> => {
  const applicableRules = filter(
    rules,
    rule =>
      isAnswered(rule.if.questionId, answers) &&
      rule.if.matches(answers[rule.if.questionId])
  );

  return keyBy(applicableRules, rule => rule.id);
};

/**
 * Determines if a question is answered, given a question id and
 * a collection of answers.
 */
export const isAnswered = (questionId: Question["id"], answers: ById<Answer>) =>
  keys(answers).includes(questionId);
