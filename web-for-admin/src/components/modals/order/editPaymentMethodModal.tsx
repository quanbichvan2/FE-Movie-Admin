import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentDto } from '../../../models/orderDto';
// Định nghĩa schema cho phương thức thanh toán
const PaymentMethodSchema = z.object({
    paymentMethodName: z.string().min(1, {
        "message": "Phải nhập tên"
    }),
    accountNumber: z.string().min(1, {
        "message": "Phải nhập stk"
    }).regex(/^\d+$/, {
        message: "Phải nhập số"
    }),
    accountHolder: z.string().min(1, {
        "message": "Phải nhập tên"
    }),
    accountStatus: z.string().min(1, {
        "message": "Phải chọn trạng thái"
    })
});
type PaymentSchema = z.infer<typeof PaymentMethodSchema>
// Props cho modal
interface PaymentMethodModalProps {
    show: boolean;
    paymentItem: PaymentDto;
    handleClose: () => void;
    handleOnSubmit: (data: PaymentSchema) => void;
    action: 'create' | 'edit'

}
const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ paymentItem, show, handleClose, handleOnSubmit,  action}) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PaymentSchema>({
        resolver: zodResolver(PaymentMethodSchema)
    });
    //const [formData, setFormData] = useState<PaymentDto>(() => paymentItem);
    useEffect(() => {
        if(action == 'edit' &&  paymentItem){
            
            reset({
                paymentMethodName: paymentItem.name,
                accountNumber: paymentItem.account,
                accountHolder: paymentItem.accountName,
                accountStatus: paymentItem.status
            })
        }
        else if (action == 'create'){
            reset({
                paymentMethodName: '',
                accountNumber: '',
                accountHolder: '',
                accountStatus: ''            
            })
        }
    }, [paymentItem,action])

    // const onChangeTextBox = (name: keyof PaymentDto) => (event: any) => {
    //     setFormData((prev) => ({ ...prev, [name]: event.target.value }))
    // };
    const submitForm = (data: PaymentSchema) => {
        //  handleOnSubmit(data);
        // console.log(errors);
        console.log(data);

        // handleClose();
    };
    return (
        <div className={`modal fade ${show && 'show'}`} style={{ display: show ? 'block' : 'none' }} aria-labelledby="paymentMethodModalLabel" aria-hidden={!show}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="paymentMethodModalLabel">
                            {paymentItem.name ? "Cập Nhật Phương Thức Thanh Toán"
                                :
                                "Thêm Phương Thức Thanh Toán"}
                        </h5>
                        <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form id="paymentMethodForm" onSubmit={handleSubmit(handleOnSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="paymentMethodName" className="form-label">Tên Phương Thức</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="paymentMethodName" {...register('paymentMethodName')} placeholder="Nhập tên phương thức"
                                />
                                {errors.paymentMethodName && <p style={{ color: "red" }}>{errors.paymentMethodName.message}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accountNumber" className="form-label">Số Tài Khoản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="accountNumber"
                                    placeholder="Nhập số tài khoản"
                                    {...register('accountNumber')}
                                    // value={formData.account}
                                    // onChange={onChangeTextBox('account')}
                                />
                                {errors.accountNumber && <p style={{ color: "red" }}>{errors.accountNumber.message}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="accountHolder" className="form-label">Tên Chủ Tài Khoản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="accountHolder"
                                    placeholder="Nhập tên chủ tài khoản"
                                    {...register('accountHolder')}
                                    // value={formData.accountName}
                                    // onChange={onChangeTextBox('accountName')}
                                />
                                {errors.accountHolder && <p style={{ color: "red" }}>{errors.accountHolder.message}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="paymentStatus" className="form-label">Trạng Thái</label>
                                <select
                                    className="form-select"
                                    id="paymentStatus" {...register('accountStatus')}
                                    // value={formData.status}
                                    // onChange={onChangeTextBox('status')}
                                >
                                    <option selected>Đang hoạt động</option>
                                    <option >Không hoạt động</option>
                                </select>
                                {errors.accountStatus && <p style={{ color: "red" }}>{errors.accountStatus.message}</p>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => { reset(); handleClose(); }} className="btn btn-secondary">Hủy</button>
                                <button type="submit" className="btn btn-primary" id="savePaymentMethodBtn"
                                    onClick={handleSubmit(submitForm)}
                                // onClick={() => {alert('lưu thành công') , handleClose()}}
                                >
                                    Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodModal;
