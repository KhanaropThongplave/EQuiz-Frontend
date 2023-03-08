import { ethers } from 'ethers';
import { useEffect, useState } from 'react'
import axios from "axios";
import { useMetamask } from '../hooks/useMetamask';
import { quiz } from '../quiz/questions'
import { EQuizToken__factory } from "../typechain-types";
import LoadingSpinner from '../components/Spinner';

const Quiz = (props: any) => {
  const {
    dispatch,
    state: { wallet, balance, token, symbol },
  } = useMetamask();

  const isConnected = props.isConnected;

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  const [activeQuestion, setActiveQuestion] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<any>(null)
  const [result, setResult] = useState<any>({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  })

  const { questions } = quiz
  const { question, choices, correctAnswer } = questions[activeQuestion]

  const onClickNext = () => {
    setSelectedAnswerIndex(null)
    setResult((prev: { score: number; correctAnswers: number; wrongAnswers: number }) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    )
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1)
    } else {
      setActiveQuestion(0)
      setShowResult(true)
    }
  }

  const onAnswerSelected = (answer: string, index: number) => {
    setSelectedAnswerIndex(index)
    if (answer === correctAnswer) {
      setSelectedAnswer(true)
    } else {
      setSelectedAnswer(false)
    }
  }

  const addLeadingZero = (number: number) => (number > 9 ? number : `0${number}`)

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendTransaction = async (event:any, score: number) => {
    event.preventDefault();

    if (score == 0) {
      window.location.reload()
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = (await provider.getNetwork()).chainId;
    
    if (chainId === 11155111) {
      const signer = provider.getSigner(accounts[0]);

      const EQuiz = EQuizToken__factory.connect(
        "0x481D3EFA6bF3aEbE0060c6eF078811b5789aa876",
        signer
      );

      setIsLoading(true);

      try {
        const claim = await EQuiz.claim(score);
        const claim_receipt = await claim.wait(1);

        const equizAmount = await EQuiz.balanceOf(accounts[0])
        const equizSymbol = await EQuiz.symbol()

        if (claim_receipt) {
          try {
            await axios.post("http://localhost:4000/api/equiz-token/claim", {
              score,
              claim_receipt,
            });
          } catch (error) {
            console.log(error)
          } finally {
            dispatch({
              type: "connect",
              wallet: accounts[0],
              balance: balance!,
              token: equizAmount._hex!,
              symbol: equizSymbol!,
            });
    
            setIsLoading(false)
            window.location.reload()
          }
        }
      } catch (error) {
        console.log(error)
        setIsLoading(false);
      } 
    }
  }

  return (
    <div>
      { isLoading && (
        <LoadingSpinner/>
      )}

      { !isLoading && (
        <div>
          {wallet && balance && token && (
            <div>
              <div className="address-text">
                <h3>
                  Address: <span>{wallet}</span>
                </h3>
                <h3>
                  Balance:{" "} <span>{(parseInt(balance) / 1000000000000000000)}{" "}</span>
                </h3>
                <h3>
                  Score:{" "} <span>{(parseInt(token) / 1000000000000000000)}{" "}</span> <span>{symbol}</span>
                </h3>
              </div>
              <button onClick={handleDisconnect} className="disconnect-button">
                <strong>Disconnect</strong>
              </button>
            </div>
          )}

          { isConnected && (
            <div className="quiz-container">
            {!showResult ? (
              <div>
                <div>
                  <span className="active-question-no">
                    {addLeadingZero(activeQuestion + 1)}
                  </span>
                  <span className="total-question">
                    /{addLeadingZero(questions.length)}
                  </span>
                </div>
                <h2>{question}</h2>
                <ul>
                  {choices.map((answer, index) => (
                    <li
                      onClick={() => onAnswerSelected(answer, index)}
                      key={answer}
                      className={selectedAnswerIndex === index ? 'selected-answer' : undefined}>
                      {answer}
                    </li>
                  ))}
                </ul>
                <div className="flex-right">
                  <button
                    onClick={onClickNext}
                    disabled={selectedAnswerIndex === null}>
                    {activeQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="result">
                  <h3>Result</h3>
                  <p>
                    Total Question: <span>{questions.length}</span>
                  </p>
                  <p>
                    Total Score:<span> {result.score}</span>
                  </p>
                  <p>
                    Correct Answers:<span> {result.correctAnswers}</span>
                  </p>
                  <p>
                    Wrong Answers:<span> {result.wrongAnswers}</span>
                  </p>
                </div>
                <div className="flex-middle">
                  <button onClick={(event) => sendTransaction(event, result.score)} disabled={isLoading}>Claim</button>
                </div>
              </div>
            )}
          </div>  
          )}
      </div>
    )}  
  </div>
  )
}

export default Quiz;