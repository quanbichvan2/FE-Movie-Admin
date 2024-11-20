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
  const [selectedShowTime, setSelectedShowTime] = useState<string | null>(null);

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

    const firstStartTime = formData.listHall
    .flatMap(a => a.listTime)
    .map(b => b.startTime)[0];

    if (!firstStartTime) {
      newErrors.showDate = 'Ngày suất chiếu không được để trống';
    } else if (new Date(firstStartTime) < new Date(today)) {
      newErrors.showDate = 'Ngày suất chiếu phải lớn hơn ngày hiện tại';
    }

    if (!formData.listHall.map(a => a.listTime.map(b => b.showTimes))) {
      newErrors.showTime = 'Suất chiếu không được để trống';
    }

    if (!formData.movieRuntimeMinutes || formData.movieRuntimeMinutes <= 0) {
      newErrors.duration = 'Thời lượng phải lớn hơn 0';
    }

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

  const getShowDate = (): string => {
    // Sử dụng giá trị selectedShowTime nếu có, nếu không lấy từ formData mặc định
    const firstStartTime: string | undefined = selectedShowTime || formData.listHall?.[0]?.listTime?.[0]?.startTime;

    console.log(selectedShowTime);
    
  
    if (firstStartTime) {
      const [day, month, year] = firstStartTime.split('-');
  
      if (day && month && year) {
        const formattedDateString: string = `${year}-${month}-${day}`;
        const showDate: Date = new Date(formattedDateString);
  
        if (!isNaN(showDate.getTime())) {
          const formattedDate: string = `${showDate.getFullYear()}-${(showDate.getMonth() + 1).toString().padStart(2, '0')}-${showDate.getDate().toString().padStart(2, '0')}`;
          return formattedDate;
        }
      }
    }
    return '';
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
                    src={formData.moviePosterImage}
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
                    // value={formData.startTime ? new Date(formData.startTime).toISOString().split('T')[0] : ''}
                    value={getShowDate()}
                    onChange={handleInputChange}

                  />
                  {errors.showDate && <div className="invalid-feedback">{errors.showDate}</div>}
                </div>
                <div className="col-md-6">
                  <label htmlFor="screeningRoom" className="form-label">Phòng chiếu</label>
                  <select
                    id="screeningRoom"
                    className="form-select"
                    value={formData.listHall?.map(a=>a.hallName)}
                    onChange={handleInputChange}
                  >
                    {formData.listHall?.map((hall, index) => (
                      <option key={index} value={hall.hallName}>{hall.hallName}</option>
                    ))}
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
                    value={formData.movieRuntimeMinutes}
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
                    // value={
                    //   formData.startTime
                    //     ? `${new Date(formData.startTime).getHours().toString().padStart(2, '0')}:${new Date(formData.startTime).getMinutes().toString().padStart(2, '0')}`
                    //     : ''
                    // }
                    value={
                      formData.listHall?.[0]?.listTime?.[0]?.startTime
                        ? `${new Date(formData.listHall[0].listTime[0].startTime).getHours().toString().padStart(2, '0')}:${new Date(formData.listHall[0].listTime[0].startTime).getMinutes().toString().padStart(2, '0')}`
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

