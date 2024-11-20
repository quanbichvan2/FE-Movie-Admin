import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { SeatDTO, sampleSeats } from '../../models/screeningRoomDto'; // Đảm bảo đường dẫn đúng với file DTO

const SeatManagement: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [seatData, setSeatData] = useState<SeatDTO | null>(null);
    const [seatForm, setSeatForm] = useState<SeatDTO>({ code: '', name: '', price: 0 });
    const [seats, setSeats] = useState<SeatDTO[]>(sampleSeats); // Dữ liệu mẫu
    const [errors, setErrors] = useState<{ code?: string; name?: string; price?: string }>({});
    const [alertVisible, setAlertVisible] = useState(false); // State cho thông báo

    const openSeatModal = (seat: SeatDTO | null = null) => {
        if (seat) {
            setSeatForm(seat);
            setSeatData(seat); // Lưu seatData để chỉnh sửa
        } else {
            setSeatForm({ code: '', name: '', price: 0 });
            setSeatData(null); // Đặt seatData là null cho thêm mới
        }
        setShowModal(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: { code?: string; name?: string; price?: string } = {};

        // Kiểm tra mã ghế
        if (!seatForm.code) {
            newErrors.code = "Mã ghế không được để trống";
        } else if (!/^[A-Z0-9]*$/.test(seatForm.code)) {
            newErrors.code = "Mã ghế phải ghi hoa và không được có ký tự đặc biệt";
        }

        // Kiểm tra tên ghế
        if (!seatForm.name) {
            newErrors.name = "Tên ghế không được để trống";
        } else if (!/^[\p{L}\p{N} `~]*$/u.test(seatForm.name)) {
            newErrors.name = "Tên ghế không được có ký tự đặc biệt";
        }

        // Kiểm tra giá tiền
        if (seatForm.price <= 1000) {
            newErrors.price = "Giá tiền phải lớn hơn 1000";
        }

        // Thiết lập lỗi nếu có
        setErrors(newErrors);

        // Kiểm tra xem có lỗi nào không
        if (Object.keys(newErrors).length > 0) {
            return; // Ngừng hàm nếu có lỗi
        }

        if (seatData) {
            // Chỉnh sửa ghế
            setSeats(seats.map((seat) => (seat.code === seatData.code ? seatForm : seat)));
        } else {
            // Thêm ghế mới
            setSeats([...seats, seatForm]);
        }

        // Hiển thị thông báo thành công
        setAlertVisible(true);
        setTimeout(() => setAlertVisible(false), 3000); // Tự động ẩn sau 3 giây

        setShowModal(false);
    };

    return (
        <div className="page-content">
            {/* Section Quản lý Phòng Chiếu */}
            <section className="row">
                <div className="col-12 col-lg-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between">
                            <h4>Danh Sách Ghế</h4>
                            <Button variant="outline-success" onClick={() => openSeatModal()}>Thêm Ghế Mới</Button>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Mã</th>
                                            <th>Tên Ghế</th>
                                            <th>Giá</th>
                                            <th>Hoạt Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seats.map((seat) => (
                                            <tr key={seat.code}>
                                                <td>{seat.code}</td>
                                                <td>{seat.name}</td>
                                                <td>{seat.price.toLocaleString()} VND</td>
                                                <td>
                                                    <Button
                                                        variant="outline-info"
                                                        onClick={() => openSeatModal(seat)}
                                                    >
                                                        Chỉnh Sửa Ghế
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

                {/* Modal Thêm/Sửa Ghế */}
                <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
                    <Modal.Header closeButton>
                        <Modal.Title>{seatForm.code ? 'Chỉnh Sửa Ghế' : 'Thêm Ghế Mới'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form id="seatForm" onSubmit={handleFormSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Mã Ghế</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={seatForm.code}
                                    onChange={(e) => setSeatForm({ ...seatForm, code: e.target.value })}
                                    placeholder="Nhập mã ghế"
                                    required
                                />
                                {errors.code && <span style={{ color: 'red' }}>{errors.code}</span>} {/* Hiển thị thông báo lỗi */}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tên Ghế</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={seatForm.name}
                                    onChange={(e) => setSeatForm({ ...seatForm, name: e.target.value })}
                                    placeholder="Nhập tên ghế"
                                    required
                                />
                                {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>} {/* Hiển thị thông báo lỗi */}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Giá Tiền (VND)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={seatForm.price}
                                    onChange={(e) => setSeatForm({ ...seatForm, price: Number(e.target.value) })}
                                    placeholder="Nhập giá tiền"
                                    required
                                />
                                {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>} {/* Hiển thị thông báo lỗi */}
                            </Form.Group>

                            <Button variant="primary" type="submit">Lưu Thay Đổi</Button>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
                    </Modal.Footer>
                </Modal>

                {/* Thông báo thành công */}
                {alertVisible && (
                    <Alert variant="success" style={{ width: "400px",position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>
                        Lưu thành công!
                    </Alert>
                )}
            </section>
        </div>
    );
};

export default SeatManagement;
