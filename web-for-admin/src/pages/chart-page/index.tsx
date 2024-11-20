import React, { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

const Dashboard = () => {
    const [selectedMonth, setSelectedMonth] = useState('06-2024');
    const [selectedMonthChiPhi, setSelectedMonthChiPhi] = useState('06-2024');

    const dataDoanhThu = {
        '06-2024': [6000000, 4000000, 2000000],
        '07-2024': [7000000, 5000000, 2000000],
        '08-2024': [8000000, 6000000, 2000000],
        '09-2024': [9000000, 7000000, 2000000],
    } as const;

    const dataChiPhi = {
        '06-2024': [1200000, 700000, 2500000, 1800000, 4500000],
        '07-2024': [1300000, 800000, 2600000, 1900000, 4500000],
        '08-2024': [1400000, 900000, 2700000, 2000000, 4500000],
        '09-2024': [1500000, 1000000, 2800000, 2100000, 4500000],
    } as const;

    const dataLoiNhuan = {
        '06-2024': 1800000, // Chuyển về number
        '07-2024': 1900000,
        '08-2024': 2000000,
        '09-2024': 2100000,
    } as const;
    const doanhThuChartData = {
        labels: ['Doanh Thu Tổng', 'Doanh Thu Từ Vé', 'Doanh Thu Từ Thức Ăn Vặt'],
        datasets: [
            {
                label: 'Doanh Thu',
                data: dataDoanhThu[selectedMonth as keyof typeof dataDoanhThu],
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
            },
        ],
    };

    const chiPhiChartData = {
        labels: ['Bảo Trì', 'Vệ Sinh', 'Nhân Lực', 'Mặt Bằng', 'Tổng Chi'],
        datasets: [
            {
                label: 'Chi Phí',
                data: dataChiPhi[selectedMonthChiPhi as keyof typeof dataChiPhi],
                backgroundColor: ['#f44336', '#FF9800', '#2196F3', '#4CAF50', '#FF5722'],
            },
        ],
    };


    const loiNhuanChartData = {
        labels: ['Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9'],
        datasets: [
            {
                label: 'Lợi Nhuận',
                data: [dataLoiNhuan['06-2024'], dataLoiNhuan['07-2024'], dataLoiNhuan['08-2024'], dataLoiNhuan['09-2024']],
                borderColor: '#4CAF50',  // Đường màu xanh lá
                backgroundColor: 'rgba(76, 175, 80, 0.2)', // Vùng nền phía dưới line
                fill: true, // Để vẽ vùng nền dưới đường
                pointRadius: 5, // Kích thước điểm
                borderWidth: 2, // Độ dày đường
            },
        ],
    };
    const handleDoanhThuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonth(e.target.value);
    };

    const handleChiPhiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedMonthChiPhi(e.target.value);
    };

    return (
        <>
            <header className="mb-3">
                <h3>Revenue, Expenses, and Profit</h3>
            </header>

            {/* Revenue Section */}
            <div className="container mt-5">
                <h3>Biểu Đồ Doanh Thu</h3>
                <div className="mb-3">
                    <label htmlFor="selectDoanhThu" className="form-label">Chọn Thời Gian:</label>
                    <select id="selectDoanhThu" className="form-select" value={selectedMonth} onChange={handleDoanhThuChange}>
                        <option value="06-2024">Tháng 6/2024</option>
                        <option value="07-2024">Tháng 7/2024</option>
                        <option value="08-2024">Tháng 8/2024</option>
                        <option value="09-2024">Tháng 9/2024</option>
                    </select>
                </div>
                <Bar data={doanhThuChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Doanh Thu' } } }} />

                <h3 className="mt-5">Biểu Đồ Chi Phí</h3>
                <div className="mb-3">
                    <label htmlFor="selectChiPhi" className="form-label">Chọn Thời Gian:</label>
                    <select id="selectChiPhi" className="form-select" value={selectedMonthChiPhi} onChange={handleChiPhiChange}>
                        <option value="06-2024">Tháng 6/2024</option>
                        <option value="07-2024">Tháng 7/2024</option>
                        <option value="08-2024">Tháng 8/2024</option>
                        <option value="09-2024">Tháng 9/2024</option>
                    </select>
                </div>
                <Bar data={chiPhiChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Chi Phí' } } }} />

                <h3 className="mt-5">Biểu Đồ Lợi Nhuận</h3>
                <Line data={loiNhuanChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Lợi Nhuận' } } }} />
            </div>
        </>
    );
};

export default Dashboard;
