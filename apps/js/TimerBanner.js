import React from "react";
import { Jumbotron } from "react-bootstrap";
import { useTime } from "./AlertsContext";
import { useCurrentQuestion, useNextQuestion, timeDeltaString } from "./timeUtils";

export default function TimerBanner() {
    const time = useTime();
    const currQuestion = useCurrentQuestion();
    const nextQuestion = useNextQuestion();
    // eslint-disable-next-line no-nested-ternary
    const timeString = currQuestion != null
        ? timeDeltaString(currQuestion.endTime - time)
        : nextQuestion != null
            ? timeDeltaString(nextQuestion.endTime - time)
            : "Exam ended!";

    // eslint-disable-next-line no-nested-ternary
    const nextString = currQuestion != null
        ? `You are on ${currQuestion.questionName}`
        : nextQuestion != null
            ? `Next question is ${nextQuestion.questionName}`
            : "No further questions.";

    return (
        <Jumbotron>
            <h1 className="display-1 text-center">
                {timeString}
            </h1>
            <h2 className="text-center">{nextString}</h2>
        </Jumbotron>
    );
}
