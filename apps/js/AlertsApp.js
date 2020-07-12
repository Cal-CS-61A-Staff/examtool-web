import React, { useEffect } from "react";
import {
    Col, Container, Row,
} from "react-bootstrap";
import post from "./post";

const playDemoAudio = async () => {
    try {
        const resp = await post("/demo_get_audio");
        if (resp.ok) {
            try {
                const data = await resp.json();
                const sound = new Audio(`data:audio/wav;base64,${data.audio}`);
                await sound.play();
            } catch {
                console.error("Unable to extract JSON");
            }
        }
    } catch {
        console.error("Unable to contact server");
    }
};

export default function Alerts() {
    useEffect(() => {
        playDemoAudio();
    }, []);

    return (
        <Container>
            <br />
            <Row>
                <Col>
                    <h1>Exam Alerts</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    This is a demo of the 61A Alerts TTS service.
                </Col>
            </Row>
        </Container>
    );
}
