import { createContext } from "react";

const ExamContext = createContext({
    savedAnswers: {},
    onInternetError: () => null,
    recordUnsaved: () => null,
    recordSaved: () => null,
    recordSolved: () => null,
    recordUnsolved: () => null,
});

export default ExamContext;
