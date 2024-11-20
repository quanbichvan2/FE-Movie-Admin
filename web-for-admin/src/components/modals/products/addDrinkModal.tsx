import React, { useCallback, useEffect, useState } from 'react';
import { productDto } from '../../../models/productDto';
import { addDrink, getProductsByCategoryabc } from '../../../services/productService';
import axios from 'axios';
import { toast } from 'react-toastify';

interface AddDrinkModalProps {
  categoryId : string;
  onSubmit: (data:productDto) => void;
  onClose: () => void;
}

const AddDrinkModal: React.FC<AddDrinkModalProps> = ({ categoryId,onSubmit, onClose }) => {
  const [formData, setFormData] = useState<productDto>({
    id: '',
    code: '',
    name: '',
    price: 0,
    image: '',
    description:'',
    categoryId: categoryId, // Giả sử ID cho đồ uống là 2
    // category_name: 'Drinks',

  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const DRINK_CATEGORY_ID = '1a5310dc-61b0-42fe-bbed-e5ed3475002f';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // [id]: id === 'price' 
      //   ? Number(value) 
      //   : value,
      [id]: id === 'price' ? Number(value) : value,
    }));

    // Reset lỗi khi người dùng thay đổi giá trị
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
  //     if (!validImageTypes.includes(file.type)) {
  //       setErrors((prevErrors) => ({
  //         ...prevErrors,
  //         image: 'Vui lòng chọn một tệp hình ảnh hợp lệ (.jpg, .png, .gif)!',
  //       }));
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         image: reader.result as string, // Lưu URL hình ảnh vào formData
  //       }));
  //     };
  //     reader.readAsDataURL(file); // Đọc file và tạo URL
  //   }
  // };
  const generateNewCode = useCallback(async () => {
    try {
      // Gọi API và nhận dữ liệu
      const response = await getProductsByCategoryabc(DRINK_CATEGORY_ID);

      if (!response || !Array.isArray(response.items)) {
        throw new Error('Dữ liệu trả về từ API không phải là một mảng hoặc không có trường "items"');
      }
  
      const items = response.items; // items là mảng productDto[]
      
      // Tiến hành xử lý mã code mới như trước
      const codes = items.map((food) => food.code); // Sử dụng trực tiếp items từ API
      let maxNumber = 0;
  
      codes.forEach((code) => {
        const number = parseInt(code.slice(1), 10);
        if (!isNaN(number) && number > maxNumber) {
          maxNumber = number;
        }
      });
      const newNumber = maxNumber + 1;
      const newCode =
      `F${newNumber.toString().padStart(2, '0')}`; // F + số thứ tự, đảm bảo có 2 chữ số
      setFormData((prevData) => ({
        ...prevData,
        code: newCode,
      }));
    } catch (error: any) {
      console.error('Lỗi khi tạo mã code mới:', error);
      toast.error('Lỗi khi tạo mã code mới: ' + error.message);
    }
  },[]);

  useEffect(() => {
    generateNewCode(); // Tạo mã mới khi mở modal
  }, [generateNewCode]);
  
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // Kiểm tra tên đồ uống
    if (!formData.name) {
      newErrors.name = 'Tên đồ uống không được để trống!';
    } else if (/[^a-zA-Z0-9\s\u00C0-\u1EF9]/.test(formData.name)) {
      newErrors.name = 'Tên đồ uống không được chứa ký tự đặc biệt!';
    }

    // Kiểm tra mã code
    if (!formData.code) {
      newErrors.code = 'Mã code không được để trống!';
    } else if (/[^a-zA-Z0-9\s\u00C0-\u1EF9]/.test(formData.code)) {
      newErrors.code = 'Mã code không được chứa ký tự đặc biệt!';
    } else if (!/[a-zA-Z]/.test(formData.code) || !/[0-9]/.test(formData.code)) {
      newErrors.code = 'Mã code phải chứa cả chữ và số!';
    }

    // Kiểm tra giá
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0!';
    }

    // Kiểm tra URL hình ảnh
    if (!formData.image) {
      newErrors.image = 'Hình ảnh không được để trống!';
    }

    // Cập nhật lại lỗi nếu có
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra validate trước khi submit
    if (!validate()) {
      return;
    }
  
    console.log('Dữ liệu gửi đến API:', formData); // Ghi lại dữ liệu
  
    try {
      var res = await addDrink(formData); // Gọi service để thêm đồ uống
      console.log(res);
      onSubmit(formData);
      toast.success('Thêm thành công!');
      onClose();
    } catch (error: any) {
      // Kiểm tra nếu error là AxiosError
      if (axios.isAxiosError(error)) {
        console.error('Lỗi khi thêm đồ uống:', error.response?.data.message || error.message);
        console.error('Dữ liệu phản hồi lỗi:', error.response?.data.errors);
        setErrors({ submit: error.response?.data.message || 'Có lỗi xảy ra khi thêm đồ uống. Vui lòng thử lại!' });
      } else {
        console.error('Lỗi không phải Axios:', error);
        setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại!' });
      }
    }
  };

  return (
    <div className="modal fade show" tabIndex={-1} style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Đồ Uống</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="addDrinkForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên Đồ Uống</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <div className="error-message text-danger">{errors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label">Mã Code</label>
                <input
                  type="text"
                  className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
                {errors.code && <div className="error-message text-danger">{errors.code}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá</label>
                <input
                  type="number"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="error-message text-danger">{errors.price}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Hình Ảnh</label>
                <input
                  // type="file"
                  type="text"
                  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  id="image"
                  value={formData.image}
                  // onChange={handleFileChange} // Gọi hàm xử lý file
                  onChange={handleChange} // Gọi hàm xử lý file
                  required
                />
                {errors.image && <div className="error-message text-danger">{errors.image}</div>}
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" width="150" />
                  </div>
                )}
              </div>
              {errors.submit && <div className="error-message text-danger">{errors.submit}</div>}
              <div className="d-flex justify-content-end" style={{ marginTop: '15px', gap: '15px' }}>
                <button type="submit" className="btn btn-primary">Lưu</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDrinkModal;