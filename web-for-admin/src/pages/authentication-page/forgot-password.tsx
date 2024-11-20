import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/bg/bgfor.png'
import '../../assets/css/pages/forgot.css'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function ForgetPassword() {
    const [show, setShow] = useState(false);
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng
    const handleClose = () => setShow(false);
    const handleShow = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của form
        const form = document.getElementById('ForgotPasswordForm') as HTMLFormElement;
        if (form.checkValidity()) {
            setShow(true);
            setTimeout(() => {
                handleClose();
                navigate('/otp-message');
            }, 3000);
        } 
        else {
            form.reportValidity();
        }
    };
    return (
        <>
            <div className="container-fluid login-container">
                <div className="login-card">
                    <div className="illustration">
                        <img src={logo} alt="Illustration" />
                    </div>
                    <div className="forgotPassword-form">
                        <h1> Forgot Password </h1>
                        <br />
                        <p> Enter your registered email address. we’ll send you a code to reset your password.</p>
                        <form id="ForgotPasswordForm">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input type="email" className="form-control" id="email" placeholder="abc@example.com" required />
                            </div>
                            <Button variant="primary" className="btn btn-primary w-100" onClick={handleShow}>
                                Send OTP
                            </Button>
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        OTP Verified
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Your OTP has been successfully verified. You will be redirected to the login page shortly.</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </form>
                        <div className='link-back'>
                            <Link to="/Login">&larr; Back</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
};