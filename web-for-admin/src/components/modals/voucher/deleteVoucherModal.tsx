import React from 'react';

interface DeleteVoucherModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    voucherDescription: string;
}

const DeleteVoucherModal: React.FC<DeleteVoucherModalProps> = ({ show, onHide, onConfirm, voucherDescription }) => {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} tabIndex={-1} style={{ display: show ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Dừng Khuyến Mãi</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn có chắc chắn muốn dừng khuyến mãi "<strong>{voucherDescription}</strong>"?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>
                            Hủy
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>
                            Dừng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteVoucherModal;
