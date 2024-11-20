import React, { useState } from 'react';
import logo from '../../assets/images/bg/bglogin.png'
import '../../assets/css/pages/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios';
import instance from '../../apis/base';
export interface PaginationRes {
    message: string;
    isSuccess: boolean;
    token: string;
}
// const configAxios = axios.create({
//     baseURL: "https://localhost:7022/",
//     timeout: 5000,
//     headers: {
//         /*Authorization: localStorage.getItem("token"),*/
//         "Content-Type": "application/json",
//     },
// });
export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await instance.post('identity-module/Identity/login', { email, password })
                .then(res => {
                    // console.log(res);
                    if(res.data.isSuccess){
                    // Lưu token vào localStorage hoặc sessionStorage
                        localStorage.setItem('accessToken', res.data.token);
                        navigate('/Dashboard'); // Điều hướng tới trang admin
                    }
                    else{
                        setErrorMessage(res.data.message);
                    }
                })
                .catch(err => {
                    // console.log(err.data);
                    setErrorMessage(err.data.message);
                });
        } catch (error) {
            //phần này bị thừa để yên để test lỗi BE, đừng xóa
            const err = error as AxiosError;
            const errorMessage = (err.response?.data && typeof err.response.data === 'object' && 'message' in err.response.data)
                ? (err.response.data as { message: string }).message
                : 'Login failed';
            setErrorMessage(errorMessage);
        }
    };
    return (
        <main id='authentication'>
            <div className="container-fluid login-container">
                <div className="login-card">
                    <div className="illustration">
                        <img src={logo} alt="Illustration"></img>
                    </div>
                    <div className="login-form">
                        <h1>Mazer <span>&#128075;</span></h1>
                        <p>
                            Welcome
                            <span>&#128075;</span>
                            <br></br>
                            Please login here
                        </p>
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="abc@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {/* cần xử lý con mắt, khi ra khỏi textbox click lại thì mất con mắt */}
                                </div>
                            </div>
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Link to="/forgot-password" className="forget-password">
                                    Forgot Password?
                                </Link>
                            </div>
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
};