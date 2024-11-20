import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { Feedback } from '../../../../src/common/feedbackType';
interface FeedbackModalProps {
    show: boolean;
    handleClose: () => void;
    feedback: Feedback | null; // cho phép null
    onSubmitResponse: (response: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ show, handleClose, feedback, onSubmitResponse }) => {
    const [textAnswer, setTextareaValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!textAnswer.trim()) {
            setErrorMessage('Vui lòng nhập nội dung trả lời.');
            alert('Vui lòng nhập nội dung trả lời.');
        } else {
            // onSubmitResponse(textAnswer);
            alert(`Đã gửi phản hồi`);
            handleClose();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi Tiết Góp Ý</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {feedback ? ( // kiểm tra feedback không null
                    <Form id="responseForm">
                        <div className="mb-3">
                            <label htmlFor="feedbackEmail" className="form-label">Email Người Gửi</label>
                            <input
                                type="email"
                                className="form-control"
                                id="feedbackEmail"
                                value={feedback.email}
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="issueContent" className="form-label">Vấn Đề</label>
                            <input
                                className="form-control"
                                id="issueContent"
                                value={feedback.issue}
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="feedbackContent" className="form-label">Nội Dung Góp Ý</label>
                            <textarea
                                className="form-control"
                                id="feedbackContent"
                                rows={4}
                                value={feedback.content}
                                required
                                disabled
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dateSend" className="form-label">Ngày Gửi</label>
                            <input
                                className="form-control"
                                id="dateSend"
                                value={feedback.dateSent}
                                required
                                disabled
                            />
                        </div>
                    </Form>
                ) : (
                    <p>Không có thông tin phản hồi.</p> // Thông báo khi feedback là null
                )}
                <hr />
                <h5>Trả Lời Góp Ý</h5>
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nội Dung Trả Lời</label>
                        <textarea
                            className="form-control"
                            id="responseContent"
                            rows={4}
                            placeholder="Nhập nội dung trả lời tại đây..."
                            value={textAnswer}
                            onChange={(e) => setTextareaValue(e.target.value)}
                        ></textarea>
                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    </div>
                    <Button type="submit" variant="primary">
                        Gửi Trả Lời
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FeedbackModal;
