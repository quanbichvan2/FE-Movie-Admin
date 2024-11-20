import React, { useState } from 'react';
import { productDto } from '../../../models/productDto';
import { editFood } from '../../../services/productService';
import { toast } from "react-toastify"
interface EditFoodModalProps {
  foodData: productDto;
  onSubmit: (data: productDto) => void;
  onClose: () => void;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ foodData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState<productDto>(foodData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: id === 'price' ? String(value) : value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) {
      newErrors.name = 'Tên món không được để trống!';
    } else if (/[^a-zA-Z0-9\s\u00C0-\u1EF9]/.test(formData.name)) {
      newErrors.name = 'Tên món không được chứa ký tự đặc biệt!';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0!';
    }
    if (!formData.image) {
      newErrors.image = 'Hình ảnh không được để trống!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const updatedFoodData = { ...formData, categoryId: foodData.categoryId };
      await editFood(formData.id, updatedFoodData);
      onSubmit(updatedFoodData);
      toast.success("Cập nhật thành công");
      onClose();
    } catch (error) {
      setErrors({ api: 'Đã xảy ra lỗi khi cập nhật sản phẩm!' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="modal fade show" tabIndex={-1} style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh Sửa Món Ăn</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form id="editFoodForm" onSubmit={handleSubmit}>
              {/* Các trường nhập liệu */}
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
                <label htmlFor="code" className="form-label">Mã Code</label>
                <input
                  type="text"
                  className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                  id="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled
                />
                {errors.code && <div className="error-message text-danger">{errors.code}</div>}
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
                {errors.code && <div className="error-message text-danger">{errors.code}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">Ảnh</label>
                <input
                  type="text"
                  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  id="image"
                  value={formData.image}
                  onChange={handleFileChange}
                />
                {errors.image && <div className="error-message text-danger">{errors.image}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá</label>
                <input
                  type="text"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  // value={formatPrice(formData.price)} 
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="error-message text-danger">{errors.price}</div>}
              </div>
              <div className="d-flex justify-content-end" style={{ marginTop: '15px', gap: '15px' }}>
                <button type="submit" className="btn btn-primary">Cập Nhật</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFoodModal;