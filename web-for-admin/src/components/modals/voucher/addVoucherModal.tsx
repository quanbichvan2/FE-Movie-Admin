import React, { useState } from 'react';
import { VoucherDto } from '../../../models/voucherDto';

// Props của component AddVoucherModal
interface AddVoucherModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (voucher: VoucherDto) => void;
}

// Kiểu dữ liệu cho state errors
interface FormErrors {
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    discountValue: string;
}

// Component AddVoucherModal
const AddVoucherModal: React.FC<AddVoucherModalProps> = ({ show, onHide, onSave }) => {
    const [voucher, setVoucher] = useState<VoucherDto>({
        code: '',
        description: '',
        startDate: '',
        endDate: '',
        isDiscountPercentage: false,
        discountValue: 0,
    });

    // Lỗi của form
    const [errors, setErrors] = useState<FormErrors>({
        code: '',
        description: '',
        startDate: '',
        endDate: '',
        discountValue: '',
    });

    // Message khi thêm thành công
    const [successMessage, setSuccessMessage] = useState<string>('');

    // Validate form
    const validateForm = (): boolean => {
        let formIsValid = true;
        const newErrors: FormErrors = {
            code: '',
            description: '',
            startDate: '',
            endDate: '',
            discountValue: '',
        };

        // Check if description is empty
        if (!voucher.description.trim()) {
            newErrors.description = 'Tên khuyến mãi là bắt buộc.';
            formIsValid = false;
        }

        // Check if discount value is non-negative
        if (voucher.discountValue < 0) {
            newErrors.discountValue = 'Giá trị giảm không được là số âm.';
            formIsValid = false;
        }

        // Check if start date is before end date
        if (voucher.startDate && voucher.endDate && voucher.startDate > voucher.endDate) {
            newErrors.startDate = 'Ngày bắt đầu không thể lớn hơn ngày kết thúc.';
            newErrors.endDate = 'Ngày kết thúc không thể nhỏ hơn ngày bắt đầu.';
            formIsValid = false;
        }

        setErrors(newErrors);
        return formIsValid;
    };

    // Handle submit form
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (validateForm()) {
            onSave(voucher);
            setSuccessMessage('Thêm khuyến mãi thành công.');
        }
    };

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabIndex={-1} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered custom-modal-size">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Thêm Khuyến Mãi</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Tên Khuyến Mãi</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={voucher.description}
                                    onChange={(e) => setVoucher({ ...voucher, description: e.target.value })}
                                    required
                                />
                                {errors.description && <div className="text-danger">{errors.description}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mã Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={voucher.code}
                                    onChange={(e) => setVoucher({ ...voucher, code: e.target.value })}
                                    required
                                />
                                {errors.code && <div className="text-danger">{errors.code}</div>}
                            </div>
                            <div className="row">
                                <div className="mb-3 col-4">
                                    <label className="form-label">
                                        {voucher.isDiscountPercentage ? 'Giảm phần trăm (%)' : 'Giảm số tiền'}
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={voucher.discountValue}
                                        onChange={(e) => setVoucher({ ...voucher, discountValue: Number(e.target.value) })}
                                        required
                                    />
                                    {errors.discountValue && <div className="text-danger">{errors.discountValue}</div>}
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="form-label">Ngày bắt đầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={voucher.startDate}
                                        onChange={(e) => setVoucher({ ...voucher, startDate: e.target.value })}
                                    />
                                    {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                                </div>
                                <div className="mb-3 col-4">
                                    <label className="form-label">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={voucher.endDate}
                                        onChange={(e) => setVoucher({ ...voucher, endDate: e.target.value })}
                                        required
                                    />
                                    {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label className="form-label">Loại Giảm Giá</label>
                                    <select
                                        className="form-select"
                                        value={voucher.isDiscountPercentage ? 'percentage' : 'fixed'}
                                        onChange={(e) =>
                                            setVoucher({ ...voucher, isDiscountPercentage: e.target.value === 'percentage' })
                                        }
                                        required
                                    >
                                        <option value="percentage">Giảm theo phần trăm</option>
                                        <option value="fixed">Giảm theo số tiền cố định</option>
                                    </select>
                                </div>
                            </div>
                            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
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

export default AddVoucherModal;
