import React, { useState } from "react";
import { Input, Space, Button, Spin, Avatar, Card, ConfigProvider } from "antd";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import { createStyles } from "antd-style";
import './Home.scss';

//https://sdk.vercel.ai/providers/ai-sdk-providers/openai#language-models

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(
          88.8deg,
          rgb(239, 171, 245) 13.4%,
          rgb(196, 181, 249) 76.3%
        );
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
  linearGradientDangerButton: css`
    &.${prefixCls}-btn-dangerous:not([disabled]) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(
          98.3deg,
          rgb(0, 0, 0) 10.6%,
          rgb(255, 0, 0) 97.7%
        );

        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const Home = () => {
  const [userUrl, setUserUrl] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [questionResponse, setQuestionResponse] = useState<string | null>(null);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [answer, setAnswer] = useState(false);
  const [isYes, setIsYes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { styles } = useStyle();
  const url = "http://localhost:3001";
  /**
   *  summarizePage is how we connect to the backend and send the url 
   *  to the endpoint: localhost:3001/summarize
   */
  const summarizePage = async () => {
    setLoading(true);
    setError(null);
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: userUrl }),
      };

      const response = await fetch(
        `${url}/summarize`,
        requestOptions
      ); // get request

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const responseJSON = await response.json(); // convert the response to JSON
      const content = responseJSON.content;
      setResponse(content);
      setAnswer(true);
    } catch (err: any) {
      setError(err.message);
      console.log("err: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   *  answerQuestion is how we send the question to the backend to 
   *  answer 
   */
  const answerQuestion = async () => {
    setLoading(true);
    setError(null);

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      };

      const response = await fetch(
        `${url}/answerQuestion`,
        requestOptions
      ); // get request

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const responseJSON = await response.json(); // convert the response to JSON
      const content = responseJSON.content;
      setQuestionResponse(content);
      setAnswer(true);
    } catch (err: any) {
      setError(err.message);
      console.log("err: " + err.message);
    } finally {
      setLoading(false)
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserUrl(e.target.value);
  };

  const handleOnChangeQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuestion(e.target.value);
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    summarizePage();
    setResponse("");
    setIsYes(null);
    setAnswer(false);
    setQuestionResponse(null);
  };

  const handleOnSubmitQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setUserQuestion("");
    answerQuestion();
    setIsYes(null);
    setAnswer(true);
  };

  const handleYesOnClick = () => {
    setIsYes("yes");
    setAnswer(false);
    setQuestionResponse(null);
  };
  const handleNoOnClick = () => {
    setIsYes("no");
    setAnswer(false);
    setQuestionResponse(null);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: "590px" }}>
        <img src="/img/smilingGirl.png" alt="Smiling girl" className="smilingGirl"/>
        
        <div className="summarizerDiv">
        <h1 className="summarizer-header">SUMMARIZER</h1>
        </div>
        <div style={{ padding: "0px 24px", marginBottom:'10px' }} className="center-content">
          <h6 style={{ color: "red" }}>
            Note: we are unable to summarize web pages that don't allow
            webscraping e.g. forbes
          </h6>
          <p>
            Give us the link to any website or article you want a summary on{" "}
            <br /> We've got you!
          </p>
          <Space.Compact style={{ width: "100%" }}>
            <Input onChange={handleOnChange} value={userUrl} />
            <Button className="summarizer-btn" onClick={handleOnSubmit}>
              Submit
            </Button>
          </Space.Compact>

          {error && (
            <Card
              // loading={loading}
              style={{ minWidth: 300, marginTop: "25px" }}
            >
              <Card.Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=10" />
                }
                title="Oops!"
                description={<p style={{ color: "red" }}>{error}</p>}
              />
            </Card>
          )}
          {response && (
            <Card
              style={{ minWidth: 300, marginTop: "25px" }}
              className="summaryCard"
            >
              <Card.Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                }
                title="Summary"
                description={<p> {response} </p>}
              />
            </Card>
          )}
          {isYes === "yes" && (
            <>
              <p>What's your question ?!</p>
              <Space.Compact style={{ width: "100%" }}>
                <Input onChange={handleOnChangeQuestion} value={userQuestion} />
                <Button onClick={handleOnSubmitQuestion} className="summarizer-btn">
                  Submit
                </Button>
              </Space.Compact>
            </>
          )}
          {questionResponse && (
            <Card
              // loading={loading}
              style={{ minWidth: 300, marginTop: "25px" }}
            >
              <Card.Meta
                avatar={
                  <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                }
                title="Answer"
                description={<p> {questionResponse} </p>}
              />
            </Card>
          )}
          {loading && <Spin size="large" style={{ marginTop: "15px" }} />}

          {answer && (
            <>
              <p>
                Do you have any questions from the article or based on the
                summary?
              </p>
              <ConfigProvider
                button={{
                  className: `${styles.linearGradientButton} ${styles.linearGradientDangerButton}`,
                }}
              >
                <Space>
                  <Button
                    type="primary"
                    icon={<SmileOutlined />}
                    onClick={handleYesOnClick}
                  >
                    Yes
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<FrownOutlined />}
                    onClick={handleNoOnClick}
                  >
                    No
                  </Button>
                </Space>
              </ConfigProvider>
            </>
          )}
          {isYes === "no" && (
            <div style={{ marginTop: 5 }}>
              Thanks for checking us out !!! 😊
            </div>
          )}
        </div>
        <img src="/img/screenGirl.png" alt="Screen girl" className="screenGirl"/>
      </div>
    </div>
  );
};

export default Home;
