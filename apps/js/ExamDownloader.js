import React, { useState } from "react";
import { getToken } from "./auth";
import FailText from "./FailText";
import LoadingButton from "./LoadingButton";
import post from "./post";

export default function ExamDownloader({ exam, onReceive }) {
    const [loading, setLoading] = useState(false);

    const [failText, setFailText] = useState("");

    const download = async () => {
        setLoading(true);
        setFailText("");
        try {
            const ret = await post("get_exam", { token: getToken(), exam });

            try {
                const data = await ret.json();

                if (ret.ok) {
                    onReceive(data);
                } else if (data.message) {
                    setFailText(`The exam server responded but did not produce a valid exam (${data.message}).`);
                } else {
                    setFailText(`The exam server responded with HTTP ${ret.status}. Please try again.`);
                }
            } catch {
                setFailText("The web server returned invalid JSON. Please try again.");
            }
        } catch {
            setFailText("Unable to reach server, your network may have issues.");
        }

        setLoading(false);
    };

    return (
        <>
            <LoadingButton onClick={download} disabled={loading} loading={loading}>
                Generate Exam
            </LoadingButton>
            <FailText text={failText} />
        </>
    );
}
