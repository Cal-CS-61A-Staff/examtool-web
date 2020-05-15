import React from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function SaveErrorModal({ onHide }) {
    return (
        <Modal show>
            <Modal.Header>
                <Modal.Title>Save Error!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                The tool was unable to save due to a network or server error.
                Please read the error under the question and try saving again.
                If this error persists, refresh the page and try again. If the
                error still persists, record your answers, and contact course
                staff or use the alternate exam medium.

                Note that if the exam has ended, you should not refresh, but
                instead record your answers and contact course staff.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>
                    I know my exam failed to save. I am still going back to the exam.
                </Button>
            </Modal.Footer>
        </Modal>

    );
}
