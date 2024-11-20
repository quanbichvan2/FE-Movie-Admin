import React from 'react';
import { OrderDto } from '../../../models/orderDto';

interface OrderDetailModalProps {
  order: OrderDto | null;
  show: boolean;
  handleClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, show, handleClose }) => {
  if (!order) return null;

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} id="orderDetailModal" aria-labelledby="orderDetailModalLabel" aria-hidden={!show}>
      <div className="modal-dialog modal-lg" style={{ maxWidth: '65%', width: '100%' }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="orderDetailModalLabel">Chi Tiết Đơn Hàng</h2>
            <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Left Column - Invoice Information */}
              <div className="col-md-6">
                <div className="card order-detail">
                  <div className="card-header row">
                    <div className="col-md-7">
                      <h3>Thông Tin Hóa Đơn</h3>
                    </div>
                    <div className="payment-date col-md-5 text-end">
                      <strong>Ngày Giao Dịch</strong>
                      <input
                        value={order.transactionDate}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Mã Hóa Đơn</label>
                      <input type="text" className="form-control" value={order.invoiceId} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Hình Thức Thanh Toán</label>
                      <input type="text" className="form-control" value={order.paymentMethod} readOnly />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nội Dung</label>
                      <input type="text" className="form-control" value={order.movieDescription} readOnly />
                    </div>
                    <div className="mb-3">
                      <img src={order.movieImage} alt="" className='movie-poster'/>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Người Thu</label>
                      <input type="text" className="form-control" value={order.cashierId} readOnly />
                    </div>
                    <div className="paymentStatus mb-3">
                      <label className="form-label">Tình Trạng Thanh Toán</label>
                      <a className={`btn ${order.paymentStatus === 'Thành Công' ? 'btn-success' : 'btn-danger'}`}>
                        {order.paymentStatus}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Purchased Products */}
              <div className="col-md-6">
                <div className="card order-detail">
                  <div className="card-header">
                    <h3>Sản Phẩm Đã Mua</h3>
                  </div>
                  <div className="card-body">
                    {order.purchasedProducts?.map((product, index) => (
                      <div key={index} className="border p-2 mb-3">
                        <div className="row mb-2">
                          <div className="col-md-3"><strong>STT:</strong></div>
                          <div className="col-md-9">
                            <input type="text" className="form-control" value={product.productId} readOnly />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-3"><strong>Sản Phẩm:</strong></div>
                          <div className="col-md-9">
                            <input type="text" className="form-control" value={product.productName} readOnly />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-3"><strong>Số Lượng:</strong></div>
                          <div className="col-md-9">
                            <input type="text" className="form-control" value={product.quantity} readOnly />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-3"><strong>Số Tiền:</strong></div>
                          <div className="col-md-9">
                            <input type="text" className="form-control" value={product.price.toLocaleString()} readOnly />
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-3"><strong>Giảm Giá:</strong></div>
                          <div className="col-md-9">
                            <input type="text" className="form-control" value={product.discount.toLocaleString()} readOnly />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="total-price mt-3">
                  <h2>Tổng Tiền: {order.totalAmount?.toLocaleString()} VND</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
