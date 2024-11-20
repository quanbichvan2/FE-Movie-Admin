import { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../../assets/css/pages/report.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { feedbacks } from '../../models/reportDto';
import FeedbackModal from '../../components/modals/report/checkReportModal';
import { Feedback } from '../../common/feedbackType';
export default function ReportPage() {
    const [show, setShow] = useState(false);
    const [textAnswer, setTextareaValue] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const handleClose = () => {
        setShow(false);
        setSelectedFeedback(null);
        setTextareaValue('');
        setErrorMessage('');
    };
    const handleShow = (feedback: Feedback) => {
        setSelectedFeedback(feedback)
        setShow(true);
    }
    function handleResponseSubmit(response: string): void {
        alert(`Đã gửi phản hồi: ${response}`);
        handleClose();
    }

    return (
        <div id="main-body">
            <div className="page-heading">
                <h3>Quản lý Góp Ý</h3>
            </div>
            <div className="page-content">
                <section className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h4>Danh Sách Góp Ý</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Vấn Đề</th>
                                                <th>Nội Dung</th>
                                                <th>Ngày Gửi</th>
                                                <th>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {feedbacks.map((feedback, index) => (
                                                <tr key={index}>
                                                    <td>{feedback.email}</td>
                                                    <td><a href="#" className="btn btn-outline-primary">{feedback.issue}</a></td>
                                                    <td>{feedback.content}</td>
                                                    <td>{feedback.dateSent}</td>
                                                    <td>
                                                        <Button variant="primary" onClick={() => handleShow(feedback)}>
                                                            Xem Chi Tiết
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <FeedbackModal
                show={show}
                handleClose={handleClose}
                feedback={selectedFeedback}
                onSubmitResponse={handleResponseSubmit}
            />
        </div>
    )
}