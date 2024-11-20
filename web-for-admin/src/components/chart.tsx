import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import plugin

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Đăng ký plugin
);

const PaymentTrendsPage = () => {
  const samplePaymentTrends = [
    { name: 'Momo', count: 22 },
    { name: 'VNPay', count: 44 },
    { name: 'Zalo Pay', count: 10 },
    { name: 'Tiền Mặt', count: 8 }
  ];

  const totalPayments = samplePaymentTrends.reduce((acc, trend) => acc + trend.count, 0);

  const paymentTrendWithPercentage = samplePaymentTrends.map((trend) => ({
    ...trend,
    percentage: ((trend.count / totalPayments) * 100).toFixed(2)
  }));

  const chartData = {
    labels: paymentTrendWithPercentage.map((trend) => trend.name),
    datasets: [
      {
        label: 'Số Lần Thanh Toán',
        data: paymentTrendWithPercentage.map((trend) => trend.count),
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#f44336']
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, 
      },
      title: {
        display: true,
        text: 'Xu Hướng Thanh Toán',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((acc: number, currentValue: number) => acc + currentValue, 0);
            const currentValue = dataset.data[tooltipItem.dataIndex];
            const percentage = ((currentValue / total) * 100).toFixed(2);
            return `${percentage}%`; 
          }
        }
      },
      datalabels: {
        color: 'white', // Màu chữ hiển thị bên trong biểu đồ
        formatter: (value: any, context: any) => {
            if (value){}// Hiển thị tên phương thức thanh toán
          return context.chart.data.labels[context.dataIndex]; 
  
        },
        font: {
          weight: 'bold' as 'bold', // Sửa kiểu dữ liệu ở đây
          size: 14
        }
      }
    }
  };

  return (
    <div className="container">
      <h3>Xu Hướng Thanh Toán</h3>
      <div style={{ width: '50%', margin: '0 auto' }}>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PaymentTrendsPage;
