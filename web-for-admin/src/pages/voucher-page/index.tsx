import React, { useState } from 'react';
import { VoucherDto } from '../../models/voucherDto';
import AddVoucherModal from '../../components/modals/voucher/addVoucherModal';
import EditVoucherModal from '../../components/modals/voucher/editVoucherModal';
import DeleteVoucherModal from '../../components/modals/voucher/deleteVoucherModal';

const VoucherPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<VoucherDto[]>([
        {
            id: 1,
            code: 'WEEKEND20',
            description: 'Khuyến mãi cuối tuần',
            startDate: '2024-08-01',
            endDate: '2024-08-29',
            isDiscountPercentage: true,
            discountValue: 20,
        },
        {
            id: 2,
            code: 'BOGO50',
            description: 'Mua 1 tặng 1',
            startDate: '2024-09-01',
            endDate: '2024-09-30',
            isDiscountPercentage: true,
            discountValue: 50,
        },
    ]);

    const [editVoucher, setEditVoucher] = useState<VoucherDto | null>(null);
    const [deleteVoucher, setDeleteVoucher] = useState<VoucherDto | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const openEditVoucherModal = (voucher: VoucherDto) => {
        setEditVoucher(voucher);
        setShowEditModal(true);
    };

    const openDeleteVoucherModal = (voucher: VoucherDto) => {
        setDeleteVoucher(voucher);
        setShowDeleteModal(true);
    };

    const handleDeleteVoucher = () => {
        if (deleteVoucher) {
            // Mark the voucher as expired by setting the endDate to a past date
            const expiredVoucher = { ...deleteVoucher, endDate: new Date().toISOString().split('T')[0] };
            setVouchers(vouchers.map(v => (v.id === expiredVoucher.id ? expiredVoucher : v)));
        }
        setShowDeleteModal(false);
    };

    return (
        <div>
            <div className="page-heading">
                <h3>Khuyến mãi</h3>
            </div>
            <div className="page-content">
                <section className="row">
                    <div className="col-12 col-lg-12">
                        <div className="card">
                            <div className="card-header d-flex justify-content-between">
                                <h4>Danh sách khuyến mãi</h4>
                                <button className="btn btn-outline-success" onClick={() => setShowAddModal(true)}>
                                    Thêm Khuyến Mãi
                                </button>
                            </div>
                            <div className="card-body">
                                <table className="table table-hover table-lg">
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>Tên</th>
                                            <th>Mã</th>
                                            <th>Ngày Kết Thúc</th>
                                            <th>Trạng thái</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vouchers.map((voucher, index) => {
                                            const isActive = new Date(voucher.endDate) >= new Date(); // Check if voucher is still valid
                                            return (
                                                <tr key={voucher.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{voucher.description}</td>
                                                    <td>{voucher.code}</td>
                                                    <td>{voucher.endDate}</td>
                                                    <td>
                                                        <button className={`btn ${isActive ? 'btn-success' : 'btn-danger'} rounded-pill`}>
                                                            {isActive ? 'Hoạt động' : 'Hết hạn sử dụng'}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() => openDeleteVoucherModal(voucher)}
                                                        >
                                                            Dừng
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-info"
                                                            onClick={() => openEditVoucherModal(voucher)}
                                                        >
                                                            Chỉnh sửa
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <AddVoucherModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                onSave={(newVoucher: VoucherDto) => {
                    setVouchers([...vouchers, newVoucher]);
                    setShowAddModal(false);
                }}
            />

            {editVoucher && (
                <EditVoucherModal
                    show={showEditModal}
                    onHide={() => setShowEditModal(false)}
                    voucher={editVoucher}
                    onSave={(updatedVoucher: VoucherDto) => {
                        setVouchers(vouchers.map(v => (v.id === updatedVoucher.id ? updatedVoucher : v)));
                        setShowEditModal(false);
                    }}
                />
            )}

            {deleteVoucher && (
                <DeleteVoucherModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteVoucher}
                    voucherDescription={deleteVoucher.description}
                />
            )}
        </div>
    );
};

export default VoucherPage;
