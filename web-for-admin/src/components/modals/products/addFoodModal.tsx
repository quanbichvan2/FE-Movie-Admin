import React, { useState, useEffect, useCallback } from 'react';
import { addFood, getProductsByCategoryabc } from '../../../services/productService'; // Import service
import { productDto } from '../../../models/productDto';
import { toast } from 'react-toastify';

interface AddFoodModalProps {
  categoryId : string;
  onClose: () => void;
  onSubmit: () => void; // Callback khi thêm thành công
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ categoryId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<productDto>({
    id: '',
    code: '',
    name: '',
    price: 0,
    image: '',
    description: '',
    categoryId: categoryId, // ID cho món ăn
    // category_name: 'Food',
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const FOOD_CATEGORY_ID = '1a5310dc-61b0-42fe-bbed-e5ed3475002d'; // Thay đổi ID này theo cấu trúc của bạn
  const generateNewCode = useCallback(async () => {
    try {
      // Gọi API và nhận dữ liệu
      const response = await getProductsByCategoryabc(FOOD_CATEGORY_ID);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === 'price' 
        ? Number(value) 
        : value,
    }));

    // Reset lỗi khi người dùng thay đổi giá trị
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: '',
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    // Kiểm tra tên món
    if (!formData.name) {
      newErrors.name = 'Tên món không được để trống!';
    } else if (/[^a-zA-Z0-9\s\u00C0-\u1EF9]/.test(formData.name)) {
      newErrors.name = 'Tên món không được chứa ký tự đặc biệt!';
    }

    // Kiểm tra giá
    if (formData.price <= 1000) {
      newErrors.price = 'Giá phải lớn hơn 1000!';
    }
    // Kiểm tra URL hình ảnh
    if (!formData.image) {
      newErrors.image = 'Link hình ảnh không được để trống!';
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

    try {
      // Gọi service để thêm món ăn
      var res = await addFood(formData);
      console.log(res);
      toast.success('Thêm thành công!');
      onSubmit(); // Gọi hàm callback để cập nhật danh sách
      
      onClose(); // Đóng modal
    } catch (error: any) {
      if (error.response.status === 400) { 
        toast.error('Tên hoặc mã của sản phẩm đã tồn tại trong hệ thống');
      } else {
        toast.error('Lỗi khi thêm sản phẩm');
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: 'Có lỗi xảy ra khi thêm món ăn. Vui lòng thử lại!',
        }));
      }
    }
  };

  return (
    <div className="modal fade show" tabIndex={-1} style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm thức ăn</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="addFoodForm" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Tên Món</label>
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
                <label htmlFor="code" className="form-label">Mã code</label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  value={formData.code}
                  readOnly // Mã code là readOnly vì được sinh tự động
                />
                {errors.code && <div className="error-message text-danger">{errors.code}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá</label>
                <input
                  type="text"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="error-message text-danger">{errors.price}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">description</label>
                <input
                  type="text"
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  value={formData.description}
                  onChange={handleChange}

                />
                </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Link Hình Ảnh</label>
                <input
                  type="text"
                  // type="file"
                  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  id="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
                {errors.image && <div className="error-message text-danger">{errors.image}</div>}
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" width="150" />
                  </div>
                )}
              </div>
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

export default AddFoodModal;