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
            ? timeDeltaString(nextQuestion.startTime - time)
            : "Exam ended!";


    return (
        <Jumbotron>
            <h1 className="display-1 text-center">
                {timeString}
            </h1>
        </Jumbotron>
    );
}
