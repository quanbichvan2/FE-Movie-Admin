import { Routes, Route, Navigate } from "react-router-dom";
import MoviePage from "./pages/movie-page/index";
import Login from "./pages/authentication-page";
import ForgetPassword from "./pages/authentication-page/forgot-password";
import OTPMessage from "./pages/authentication-page/otp-message";
import ReportPage from "./pages/Report-page";
import LayOut from "./layout";
import OrderPage from "./pages/order-page";
import ScreeningRoomPage from "./pages/screeningroom-page/index"
import Chart from "./pages/chart-page/index";;
import DashBoardPage from "./pages/dashboard-page/index";
import CommentPage from "./pages/comment-page/index";
import ProductPage from "./pages/product-page/index";
import ScheduleManagement from "./pages/show-page";
import VoucherPage from "./pages/voucher-page";
// router ở đây
function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={< Login />} />
                <Route path="/forgot-password" element={<ForgetPassword />} />
                <Route path="/otp-message" element={<OTPMessage />} />
                <Route element={<LayOut />}>
                    <Route path="/movie" element={< MoviePage />} />
                    <Route path="/report-page" element={<ReportPage />} />
                    <Route path="/order-page" element={<OrderPage />} />
                    <Route path="/room" element={< ScreeningRoomPage />} />
                    <Route path="/chart" element={< Chart />} />
                    <Route path="/dashboard" element={< DashBoardPage />} />
                    <Route path="/comment" element={< CommentPage />} />
                    <Route path="/product" element={< ProductPage />} />
                    <Route path="/show-page" element={<ScheduleManagement />} />
                    <Route path="/show-page/:movieId" element={<ScheduleManagement />} />
                    <Route path="/voucher-page" element={<VoucherPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default Router;
