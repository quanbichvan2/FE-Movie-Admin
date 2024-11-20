import React, { useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js';
import { useState } from 'react';
import { commentDto } from '../../models/commentDto'
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement);
const Dashboard = () => {
    const [comments,setComments] = useState<commentDto[]>([
        {
            id: 1,
            name: 'Si Cantik',
            movie_id: 1,
            movie_name: "dead pool",
            avatar: 'New folder (2)/DuAnTotNghiep.FeAdmin/web-for-admin/src/assets/images/faces/1.jpg',
            comment: 'Congratulations on your graduation!'
        },

        {
            id: 2,
            name: 'Si Ganteng',
            movie_id: 1,
            movie_name: "dead pool",
            avatar: 'New folder (2)/DuAnTotNghiep.FeAdmin/web-for-admin/src/assets/images/faces/2.jpg',
            comment: 'Wow amazing design! Can you make another tutorial for this design?'
        }

    ]);
    // Dữ liệu biểu đồ năm
    const yearData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Traffic',
                data: [10000, 12000, 15000, 13000, 16000, 14000, 17000, 18000, 19000, 20000, 21000, 22000],
                borderColor: 'purple',
                backgroundColor: 'rgba(128, 0, 128, 0.5)',
                borderWidth: 1
            },
            {
                label: 'Users',
                data: [20000, 22000, 25000, 23000, 26000, 24000, 27000, 28000, 29000, 30000, 31000, 32000],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderWidth: 1
            }
        ]
    };

    // Dữ liệu biểu đồ tháng
    const monthData = {
        labels: Array.from({ length: 30 }, (v, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Traffic',
                data: [3000, 3200, 3500, 3400, 3600, 3800, 3900, 4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400],
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderWidth: 1
            },
            {
                label: 'Users',
                data: [5000, 5200, 5500, 5400, 5600, 5800, 5900, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9000, 9200, 9400, 9600, 9800, 10000, 10200, 10400],
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderWidth: 1
            }
        ]
    };

    // Hàm để hiển thị biểu đồ
    const [chartData, setChartData] = React.useState(yearData);

    const showYearChart = () => {
        setChartData(yearData);
    };

    const showMonthChart = () => {
        setChartData(monthData);
    };

    useEffect(() => {
        // Mặc định hiển thị biểu đồ cả năm
        showYearChart();
    }, []);

    // Dữ liệu cho biểu đồ pie
    const pieData = {
        labels: ['Online Booking', 'Offline Booking'],
        datasets: [{
            data: [8000000, 7000000],
            backgroundColor: ['#4CAF50', '#FF98000'],
        }]
    };

    return (
<>
            <header className="mb-3">
                <a href="#" className="burger-btn d-block d-xl-none">
                    <i className="bi bi-justify fs-3"></i>
                </a>
            </header>

            <div className="page-heading">
                <h3>Dashboard</h3>
            </div>

            <div className="page-content">
                <section className="row">
                    <div className="col-12 col-lg-9">
                        <div className="row">
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                    <div className="card-body px-3 py-4-5">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="stats-icon purple">
                                                    <i className="iconly-boldAdd-User"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="text-muted font-semibold">Traffic</h6>
                                                <h6 className="font-extrabold mb-0">112.000</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                    <div className="card-body px-3 py-4-5">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="stats-icon blue">
                                                    <i className="iconly-boldProfile"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="text-muted font-semibold">User</h6>
                                                <h6 className="font-extrabold mb-0">183.000</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                    <div className="card-body px-3 py-4-5">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="stats-icon green">
                                                    <i className="iconly-boldShow"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="text-muted font-semibold">Số phim đang chiếu</h6>
                                                <h6 className="font-extrabold mb-0">12</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 col-lg-3 col-md-6">
                                <div className="card">
                                    <div className="card-body px-3 py-4-5">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="stats-icon red">
                                                    <i className="fa-solid fa-chalkboard"></i>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <h6 className="text-muted font-semibold">Phòng chiếu</h6>
                                                <h6 className="font-extrabold mb-0">6</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Thu nhập</h4>
                                    </div>
                                    <div className="card-body">
                                        <Bar
                                            data={chartData}
                                            options={{
                                                responsive: true,
                                                plugins: {
                                                    legend: {
                                                        position: 'top',
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'Thống kê'
                                                    }
                                                }
                                            }}
                                        />
                                        <div className="d-flex justify-content-center mt-3">
                                            <button className="btn btn-outline-primary me-2" onClick={showYearChart}>Cả Năm</button>
                                            <button className="btn btn-outline-secondary" onClick={showMonthChart}>Tháng Này</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-xl-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4>Bình luận cần được duyệt</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-lg">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Comment</th>
                                                        <th>Movie</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {comments.map(comment => (
                                                        <tr key={comment.id}>
                                                            <td>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="avatar avatar-md">
                                                                        <img src={comment.avatar} alt="Avatar" />
                                                                    </div>
                                                                    <p className="font-bold ms-3 mb-0">{comment.name}</p>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.movie_name}</p>
                                                            </td>
                                                            <td>
                                                                <p className="mb-0">{comment.comment}</p>
                                                            </td>
                                                            <td>
                                                                <a href="#" className="btn btn-outline-success">Đồng ý</a>
                                                                <a href="#" className="btn btn-outline-danger ms-3">Từ chối</a>
                                                                <a href="#" className="btn btn-outline-info ms-3">
                                                                    <i className="fa-solid fa-share"></i>
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-lg-3">
                        <div className="card">
                            <div className="card-header">
                                <h4>Biểu đồ doanh thu</h4>
                            </div>
                            <div className="card-body">
                                <Pie
                                    data={pieData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                position: 'top',
                                            },
                                            title: {
                                                display: true,
                                                text: 'Doanh thu'
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            </>
    );
};

export default Dashboard;