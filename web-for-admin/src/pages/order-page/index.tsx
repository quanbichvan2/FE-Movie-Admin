import "../../assets/css/pages/order.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentDto, sampleOrder, samplePaymentMethods } from "../../models/orderDto.tsx";
import OrderDetailModal from "../../components/modals/order/editDetailOrderModal.tsx";
import PaymentMethodModal from "../../components/modals/order/editPaymentMethodModal.tsx";

export default function OrderPage() {
  // validate đọc doc Zod
  const initialFormState = {id:'',name:'',status:'',account:'',accountName:''}
  const PaymentMethodSchema = z.object({
    paymentMethodName: z.string().min(1, {
      message: "Phải nhập tên",
    }),
    accountNumber: z
      .string()
      .min(1, {
        message: "Phải nhập stk",
      })
      .regex(/^\d+$/, {
        message: "Phải nhập số",
      }),
    accountHolder: z.string().min(1, {
      message: "Phải nhập tên",
    }),
    accountStatus: z.string().min(1, {
      message: "Phải chọn trạng thái",
    }),
  });

  const {
    formState: { },
  } = useForm<z.infer<typeof PaymentMethodSchema>>({
    resolver: zodResolver(PaymentMethodSchema),
  });

  // xử lý modal xem chi tiết hóa đơn
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDto>(initialFormState);
  const [showModal, setShowModal] = useState(false);
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [modalAction,setModalAction]=useState<'create' | 'edit'>('create')

  // Function to handle modal submission
  // const handleOnSubmit = async (data: z.infer<typeof PaymentMethodSchema>) => {
  //   console.log('123');
  // };
  //xử lý bên order mốt viết gộp if lại
  const handleShowModal = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };
  // xử lý payment
  const handleUpdatePayment = (paymentItem: any) => {
    setSelectedPayment(paymentItem);
    setModalAction('edit')
    setShowModalPayment(true);
  };
  const handleCloseModalPayment = () => {
    setShowModalPayment(false);
    setSelectedPayment(initialFormState);
  };
  const handleCreatePayment = () => {
    setShowModalPayment(true)
    setModalAction('create')
  }
  return (
    <div>
      <div className="page-heading">
        <h3>Quản lý Đơn Hàng</h3>
      </div>
      <div className="page-content">
        {/* 2 section cho mỗi body-content */}
        <section className="row">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Danh Sách Đơn Hàng</h4>
                <div className="d-flex">
                  <input
                    type="date"
                    id="orderFromDate"
                    className="form-control me-2"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    id="orderToDate"
                    className="form-control"
                    placeholder="Đến ngày"
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Ngày</th>
                        <th>Số Tiền Thanh Toán</th>
                        <th>Tổng Tiền</th>
                        <th>Tạo Bởi</th>
                        <th>Phương Thức Thanh Toán</th>
                        <th>Tình Trạng</th>
                        <th>Hoạt Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleOrder.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.date}</td>
                          <td>{order.paymentAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} VND</td>
                          <td>{order.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND'})} VND</td>
                          <td>{order.createBy}</td>
                          <td>{order.paymentMethod}</td>
                          <td>
                            <span
                              className={`btn ${
                                order.status === "Thành Công"
                                  ? "btn-success"
                                  : "btn-danger"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-info"
                              onClick={() => handleShowModal(order)}
                            >
                              Xem Chi Tiết
                            </button>
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
        <OrderDetailModal
          show={showModal}
          order={selectedOrder}
          handleClose={handleCloseModal}
        />
        <section className="row">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Danh Sách Phương Thức Thanh Toán</h4>
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-primary"
                    id="addPaymentMethodBtn"
                    data-bs-toggle="modal"
                    data-bs-target="#paymentMethodModal"
                    onClick={() => handleCreatePayment()}
                  >
                    Thêm Phương Thức
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Tình Trạng</th>
                        <th>Hoạt Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {samplePaymentMethods.map((paymentItem) => (
                        <tr key={paymentItem.id}>
                          <td>{paymentItem.id}</td>
                          <td>{paymentItem.name}</td>
                          <td>
                            <span className="badge bg-success">
                              {paymentItem.status}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              id="addPaymentMethodBtn"
                              data-bs-toggle="modal"
                              data-bs-target="#paymentMethodModal"
                              onClick={() =>
                                handleUpdatePayment(paymentItem)
                              }
                            >
                              Chỉnh sửa
                            </button>
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
        <PaymentMethodModal
          show={showModalPayment}
          paymentItem={selectedPayment}
          handleClose={handleCloseModalPayment}
          handleOnSubmit={()=>{}}
          action={modalAction}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h4>XU HƯỚNG THANH TOÁN</h4>
        </div>
        <div className="card-body">
          <canvas id="paymentTrendChart"></canvas>
        </div>
      </div>
    </div>
  );
}
