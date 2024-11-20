import logo from '../../assets/images/bg/bgfor.png'
import '../../assets/css/pages/otp.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
export default function OTPMessage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [input, setInput] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        input5: '',
        input6: '',
    });
    const navigate = useNavigate();
    const handleNavigate = () => {        
        if (input.input1.trim() && input.input2.trim() && input.input3.trim() && input.input4.trim() && input.input5.trim() && input.input6.trim()) {
            navigate('/login');
        }
        else{
            setErrorMessage('Vui lòng nhập nội dung trả lời.');
        }
    }
    const handleInputChange = (e: any) => {
        const re = /^\d$/;
        const { name, value } = e.target;
        if(re.test(value) == true){
            setInput((prevFormData) => ({
                ...prevFormData,
                [name]: value
            }));
        }
        setErrorMessage('Vui lòng nhập dạng số.');
    }
    return (
        <div className="container-fluid otp-container">
            <div className="otp-card">
                <div className="illustration">
                    <img src={logo} alt="Illustration" />
                </div>
                <div className="otp-form">
                    <h1>Enter OTP</h1>
                    <p>
                        We have shared a code to your registered email address
                        <br />
                        robertallen@example.com
                    </p>
                    <form id="otpForm">
                        <div className="d-flex justify-content-between mb-4">
                            <input name='input1' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input1} onChange={handleInputChange} />
                            <input name='input2' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input2} onChange={handleInputChange} />
                            <input name='input3' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input3} onChange={handleInputChange} />
                            <input name='input4' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input4} onChange={handleInputChange} />
                            <input name='input5' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input5} onChange={handleInputChange} />
                            <input name='input6' type="text" className="otp-text-box form-control otp-input" maxLength={1}  value={input.input6} onChange={handleInputChange} />
                        </div>
                        <button type='button' className="btn btn-primary w-100" onClick={handleNavigate}>Verify</button>
                        <div className='error'>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        </div>
                    </form>
                    <div className='link-back'>
                        <Link to="/Login">&larr; Back</Link>
                    </div>
                </div>
            </div>
        </div>
    )
};