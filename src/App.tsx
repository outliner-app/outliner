import { Layout, Row, Col, Tabs, Card, Radio } from "antd";
import { questions } from "./content/questions";
import { ById, Answer, Option } from "./types";
import React, { useState } from "react";
import { rules } from "./content/rules";
import { values, omit } from "lodash";
import "./App.css";
import {
  getApplicableRulesForProvidedAnswers,
  getInvalidAnswers,
  inferAnswers,
  isAnswered
} from "./lib/utils";
import { Code } from "./components/Code";

const App = () => {
  // TODO: dark mode
  const [providedAnswers, setProvidedAnswers] = useState({} as ById<Answer>);
  const inferredAnswers = inferAnswers(questions, providedAnswers, rules);

  return (
    <Layout>
      <Layout.Content style={{ background: "#fff" }}>
        <Row gutter={24}>
          <Col span={14}>
            {values(questions).map(question => (
              <Card
                title={question.title}
                bordered={false}
                key={question.id}
                style={{ opacity: question.id in inferredAnswers ? 0.75 : 1 }}
              >
                {question.id in inferredAnswers ? (
                  <div style={{ height: 32 }}>
                    {
                      (questions[question.id].options.find(
                        option => option.value === inferredAnswers[question.id]
                      ) as Option).title
                    }
                  </div>
                ) : (
                  <Radio.Group
                    buttonStyle="solid"
                    value={
                      {
                        ...inferredAnswers,
                        ...providedAnswers
                      }[question.id]
                    }
                    onChange={e => {
                      setProvidedAnswers({
                        ...providedAnswers,
                        [question.id]: e.target.value
                      });
                    }}
                  >
                    {question.options.map(option => (
                      <Radio.Button
                        key={option.value}
                        value={option.value}
                        disabled={getInvalidAnswers(
                          question,
                          getApplicableRulesForProvidedAnswers(
                            { ...providedAnswers, ...inferredAnswers },
                            rules
                          )
                        ).some(answer => answer.value === option.value)}
                      >
                        {option.title}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                )}

                {isAnswered(question.id, providedAnswers) && (
                  <a
                    style={{ paddingLeft: 8 }}
                    onClick={() => {
                      setProvidedAnswers(omit(providedAnswers, question.id));
                    }}
                  >
                    clear
                  </a>
                )}
              </Card>
            ))}
          </Col>

          <Col span={10}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="code" key="1">
                <Code
                  providedAnswers={providedAnswers}
                  inferredAnswers={inferredAnswers}
                />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
};

export default App;
