import React, { useEffect, useState } from "react";
import {
    Card,
    Col, Container, Form, ListGroup, Row,
} from "react-bootstrap";
import AlertsContext from "./AlertsContext";
import { getToken } from "./auth";
import ConnectAlertButton from "./ConnectAlertButton";
import GoogleSignInButton from "./GoogleSignInButton";
import post from "./post";
import TimerBanner from "./TimerBanner";
import { timeDeltaMinutesString } from "./timeUtils";
import useInterval from "./useInterval";
import useTick from "./useTick";

export default function Alerts() {
    const [username, setUsername] = useState("");
    const [examList, setExamList] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [examData, setExamData] = useState(null);
    const [stale, setStale] = useState(false);

    const time = useTick();

    const handleExamSelect = (e) => {
        setSelectedExam(e.target.value);
    };

    useEffect(() => {
        (async () => {
            setExamList(await (await post("list_exams")).json());
        })();
    }, []);

    useInterval(async () => {
        if (examData) {
            try {
                const resp = await post("fetch_data", { token: getToken(), exam: selectedExam });
                if (resp.ok) {
                    const data = await resp.json();
                    if (data.success) {
                        setExamData(data);
                        setStale(false);
                    }
                }
            } catch (e) {
                console.error(e);
                setStale(true);
            }
        }
    }, 10000);

    return (
        <AlertsContext.Provider value={{ time, examData, stale }}>
            <Container>
                <br />
                <Row>
                    <Col>
                        <h1>Exam Announcements</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <GoogleSignInButton
                            onSuccess={setUsername}
                        />
                    </Col>
                </Row>
                <br />
                {username && !examData && (
                    <Row>
                        <Col>
                            <Form>
                                <Form.Group controlId="exampleForm.SelectCustom">
                                    <Form.Label>Now, choose your exam:</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={selectedExam}
                                        onChange={handleExamSelect}
                                        custom
                                    >
                                        <option hidden disabled selected value="">Select an exam</option>
                                        {examList.map((exam) => <option>{exam}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                )}
                {selectedExam && !examData && (
                    <Row>
                        <Col>
                            <p>
                                You have selected the exam
                                {" "}
                                <b>{selectedExam}</b>
                                . If this does not look correct, please re-select your exam.
                            </p>
                            <p>
                                Otherwise, click the button to connect to the exam server.
                                You can do this before the exam begins.
                            </p>
                            <ConnectAlertButton exam={selectedExam} onReceive={setExamData} />
                        </Col>
                    </Row>
                )}
                {examData && (
                    <>
                        <Row>
                            <Col>
                                <TimerBanner data={examData} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header>Announcements</Card.Header>
                                    <ListGroup variant="flush">
                                        {
                                            examData.announcements.map(
                                                ({ id, message, time: announcementTime }) => (
                                                    <ListGroup.Item key={id}>
                                                        {message}
                                                        {" "}
                                                        (
                                                        {timeDeltaMinutesString(
                                                            time - announcementTime,
                                                        )}
                                                        )
                                                    </ListGroup.Item>
                                                ),
                                            )
                                        }
                                    </ListGroup>
                                </Card>
                            </Col>
                            <Col>
                                <Card>
                                    Test
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </AlertsContext.Provider>
    );
}
