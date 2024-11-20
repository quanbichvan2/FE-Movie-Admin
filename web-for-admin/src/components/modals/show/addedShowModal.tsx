import React, { useState } from 'react';
// import { ShowDto } from '../../../models/showDto';
// import { Item } from '../../../pages/show-page';
import { Show } from '../../../models/showDto';
import instance from '../../../apis/base';

// Định nghĩa props cho modal
interface AddShowToExistingMovieModalProps {
  // movieName: string;
  movieName:Show;
  onSave: (newShow: Show) => void;
  onClose: () => void;
}

// Component cho modal Thêm Suất Chiếu
const AddedShowModal: React.FC<AddShowToExistingMovieModalProps> = ({ movieName, onSave, onClose }) => {
  // Quản lý trạng thái input

  const [showTime, setShowTime] = useState('');
  const [showDate, setShowDate] = useState('');
  const [screeningRoom, setScreeningRoom] = useState('');

  const [error, setError] = useState<string | null>(null); // Để hiển thị lỗi xác thực
  const [showAlert, setShowAlert] = useState(false); // Hiển thị modal thông báo
  // const [startTime,setStartTime]=useState<string>('')
  // const [endTime,setEndTime]=useState<string>('')
  // Xử lý lưu thông tin suất chiếu mới
  const handleSave = async () => {
    console.log(movieName)
    const currentDate = new Date();
    const selectedDate = new Date(showDate + 'T' + showTime);
    
    
    // const start = new Date(`${startTime}`)
     
    // const end = new Date(`${endTime}`)

    if (!showTime || !showDate || !screeningRoom) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (selectedDate <= currentDate) {
      setError('Ngày và giờ chiếu phải trong tương lai.');
      return;
    }


    // Tân Thế
    // có vài chỗ bị đỏ nếu được thì thêm biến thôi, nó vẫn đang chạy bth. Nhớ trước khi làm tạo sẵn 1 bản coppy, mất code t giết m
    // nếu được làm thêm quả check time start nó có đang chiếu ko, nếu có thì không được thêm suất chiếu đúng cái phòng chiếu đang chiếu phim đó (ko làm đc thì thôi ping t, t sử lý sau)
    const newShow: Show = {
      // hallName: '', // xử lý validation thằng này
      // cinemaName: movieName.cinemaName,
      // movieTitle: movieName.movieTitle,
      // startTime: movieName.startTime, // xử lý thằng này convert ra đàng hoàng
      // endTime: movieName.endTime,   // xử lý thằng này convert ra đàng hoàng
      // cinemaHallId: movieName.cinemaHallId,
      // movieId: movieName.movieId
      id: '',
      movieTitle: '',
      listHall: [],
      movieId: '',
      genres: [],
      movieRuntimeMinutes: 0,
      moviePosterImage: '',
      ageRating: 0
    };
    try {
      const response = await instance.post('movie-management-module/Shows', newShow)
      onSave(response)
    } catch (error) {
      console.log(error)
    }
     
    onSave(newShow); // Gọi onSave từ props để lưu suất chiếu
    setError(null); // Xóa lỗi trước đó
    setShowAlert(true); // Hiển thị modal thông báo
  };

  return (
    // Cấu trúc modal Bootstrap
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Suất Chiếu cho {movieName.movieTitle}</h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>} {/* Hiển thị lỗi xác thực */}
            <div className="form-group">
              <label>Suất Chiếu:</label>
              <input
                type="time"
                className="form-control"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)} // Cập nhật giờ chiếu khi thay đổi
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày Chiếu:</label>
              <input
                type="date"
                className="form-control"
                value={showDate}
                onChange={(e) => setShowDate(e.target.value)} // Cập nhật ngày chiếu khi thay đổi
                required
              />
            </div>
            <div className="form-group">
              <label>Phòng chiếu</label>
              <select
                id="screeningRoom"
                className="form-select"
                value={screeningRoom}
                onChange={(e) => setScreeningRoom(e.target.value)} // Cập nhật phòng chiếu khi thay đổi
                required
              >
                <option value="">Chọn phòng chiếu</option> {/* Tùy chọn mặc định */}
                <option value="PC01">PC01</option>
                <option value="PC02">PC02</option>
                <option value="PC03">PC03</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Lưu
            </button>
          </div>
          {showAlert && (
            <div className="alert alert-success">
              Thêm suất chiếu thành công!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddedShowModal;

