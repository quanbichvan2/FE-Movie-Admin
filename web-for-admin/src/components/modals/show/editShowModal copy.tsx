import React, { useState, useEffect } from 'react';
import { Show } from '../../../models/showDto';
// import { ShowDto } from '../../../models/showDto';
// import { Item } from '../../../pages/show-page';

// Props cho EditShowModal
interface EditShowModalProps {
  show: Show;
  onSave: (updatedShow: Show) => void;
  onClose: () => void; // Hàm đóng modal
}

// Component EditShowModal
const EditShowModal: React.FC<EditShowModalProps> = ({ show, onSave, onClose }) => {
  const [formData, setFormData] = useState<Show>(show);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(show);
    setErrors({});
  }, [show]);
  // Hàm xử lý khi thay đổi giá trị của một field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: id === 'ticketPrice' || id === 'duration' ? Number(value) : value,
    });
  };

  // Hàm validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date().toISOString().split('T')[0];

    if (!formData.startTime) {
      newErrors.showDate = 'Ngày suất chiếu không được để trống';
    } else if (new Date(formData.startTime).toISOString().split('T')[0] < today) {
      newErrors.showDate = 'Ngày suất chiếu phải lớn hơn ngày hientai';
    }

    // if (!formData.showTime) {
    //   newErrors.showTime = 'Suất chiếu không được để trống';
    // }

    // if (!formData.duration || formData.duration <= 0) {
    //   newErrors.duration = 'Thời lượng phải lớn hơn 0';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi submit form
  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose(); // Đóng modal sau khi lưu
    }
  };

  return (
    <div
      className="modal fade show" // Thêm class show để modal hiện ra
      id="editShowModal"
      tabIndex={-1}
      aria-labelledby="editShowModalLabel"
      aria-hidden="true"
      style={{ display: 'block' }} // Đảm bảo modal được hiển thị
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editShowModalLabel">Chỉnh sửa suất chiếu</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="movieName" className="form-label">Tên Phim</label>
                  <input type="text" value={formData.movieTitle} className="form-control" disabled />
                </div>
                <div className="col-md-3">
                  <img
                    src={''}
                    alt="Poster phim"
                    id="moviePoster"
                    className="mt-4"
                    style={{ width: '150px', height: 'auto' }} // Cài đặt kích thước poster
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="showDate" className="form-label">Ngày suất chiếu</label>
                  <input
                    type="date"
                    id="showDate"
                    className={`form-control ${errors.showDate ? 'is-invalid' : ''}`}
                    value={formData.startTime ? new Date(formData.startTime).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}

                  />
                  {errors.showDate && <div className="invalid-feedback">{errors.showDate}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="screeningRoom" className="form-label">Phòng chiếu</label>
                  <select
                    id="screeningRoom"
                    className="form-select"
                    value={formData.hallName}
                    onChange={handleInputChange}
                  >
                    <option value="PC01">PC01</option>
                    <option value="PC02">PC02</option>
                    <option value="PC03">PC03</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="duration" className="form-label">Thời lượng (Phút)</label>
                  <input
                    type="number"
                    id="duration"
                    className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                    value={'formData.runtimeMinutes'}
                    onChange={handleInputChange}
                  />
                  {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="showTime" className="form-label">Suất chiếu</label>
                  <input
                    type="time"
                    id="showTime"
                    className={`form-control ${errors.showTime ? 'is-invalid' : ''}`}
                    value={
                      formData.startTime
                        ? `${new Date(formData.startTime).getHours().toString().padStart(2, '0')}:${new Date(formData.startTime).getMinutes().toString().padStart(2, '0')}`
                        : ''
                    }
                    onChange={handleInputChange}
                  />
                  {errors.showTime && <div className="invalid-feedback">{errors.showTime}</div>}
                </div>

              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={() => {
              // Thêm chức năng xóa suất chiếu nếu cần
              alert("Feature not implemented yet."); // Placeholder
            }}>
              Xóa
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditShowModal;

