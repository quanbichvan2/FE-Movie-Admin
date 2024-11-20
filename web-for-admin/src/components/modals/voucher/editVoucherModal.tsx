import React, { useState, useEffect } from 'react';
import { VoucherDto } from '../../../models/voucherDto';

/**
 * Props cho modal chỉnh sửa khuyến mãi
 */
interface EditVoucherModalProps {
    show: boolean;
    onHide: () => void;
    voucher: VoucherDto;
    onSave: (voucher: VoucherDto) => void;
}

/**
 * Modal chỉnh sửa khuyến mãi
 */
const EditVoucherModal: React.FC<EditVoucherModalProps> = ({ show, onHide, voucher, onSave }) => {
    // State cho modal
    const [updatedVoucher, setUpdatedVoucher] = useState<VoucherDto>({ ...voucher });

    // State cho thông báo đã chỉnh sửa thành công
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Update state khi voucher prop thay đổi
    useEffect(() => {
        setUpdatedVoucher(voucher);  // Ensure state is updated when a new voucher prop is passed
    }, [voucher]);

    // Function để xử lý khi submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(updatedVoucher);
        setSuccessMessage('Cập nhật thành công');
    };

    // Function để xử lý khi thay đổi giá trị của một field
    const handleChange = (field: keyof VoucherDto, value: string | number | boolean) => {
        setUpdatedVoucher(prevState => ({ ...prevState, [field]: value }));
    };

    // Function để validate startDate
    const validateStartDate = (startDate: string) => {
        const today = new Date();
        const startDateDate = new Date(startDate);
        return startDateDate >= today;
    };

    // Function để validate endDate
    const validateEndDate = (endDate: string) => {
        const today = new Date();
        const endDateDate = new Date(endDate);
        return endDateDate > today;
    };

    // Function để validate discountValue
    const validateDiscountValue = (discountValue: number) => {
        return discountValue > 0 && discountValue <= 100;
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabIndex={-1} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered custom-modal-size">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Chỉnh sửa Khuyến Mãi</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Mã Khuyến Mãi</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={updatedVoucher.id || ''}
                                    disabled // Không cho phép chỉnh sửa mã khuyến mãi
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Tên Khuyến Mãi</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={updatedVoucher.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mã Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={updatedVoucher.code}
                                    onChange={(e) => handleChange('code', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="row">
                                <div className="mb-3 col-4">
                                    <label className="form-label">Giảm phần trăm(%)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={updatedVoucher.discountValue}
                                        onChange={(e) => handleChange('discountValue', Number(e.target.value))}
                                        required
                                        min={0}
                                        max={100}
                                    />
                                    {!validateDiscountValue(updatedVoucher.discountValue) && (
                                        <div className="invalid-feedback">
                                            Giá trị giảm giá phải lớn hơn 0 và nhỏ hơn hoặc bằng 100
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={updatedVoucher.startDate}
                                        onChange={(e) => handleChange('startDate', e.target.value)}
                                        required
                                    />
                                    {!validateStartDate(updatedVoucher.startDate) && (
                                        <div className="invalid-feedback">
                                            Ngày bắt đầu phải lớn hơn hoặc bằng ngày hôm nay
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={updatedVoucher.endDate}
                                        onChange={(e) => handleChange('endDate', e.target.value)}
                                        required
                                    />
                                    {!validateEndDate(updatedVoucher.endDate) && (
                                        <div className="invalid-feedback">
                                            Ngày kết thúc phải lớn hơn ngày hôm nay
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label">Loại Giảm Giá</label>
                                    <select
                                        className="form-select"
                                        value={updatedVoucher.isDiscountPercentage ? 'percentage' : 'fixed'}
                                        onChange={(e) =>
                                            handleChange('isDiscountPercentage', e.target.value === 'percentage')
                                        }
                                        required
                                    >
                                        <option value="percentage">Giảm theo phần trăm</option>
                                        <option value="fixed">Giảm theo số tiền cố định</option>
                                    </select>
                                </div>
                            </div>
                            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
                            <div className="d-flex justify-content-end" style={{ marginTop: '15px', gap: '15px' }}>
                                <button type="submit" className="btn btn-primary">
                                    Lưu
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={onHide}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVoucherModal;
