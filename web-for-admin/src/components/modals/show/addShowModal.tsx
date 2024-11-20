import React, { useEffect, useState } from 'react';
// import { ShowDto } from '../../../models/showDto';
// import { Item } from '@workday/canvas-kit-react';
import { ListHall, Show } from '../../../models/showDto';
import { Movie, MovieResponse } from '../../../models/movieDto';
import { getAllTitleMovies } from '../../../services/movieService';
import { Hall } from '../../../models/hallDto';
import { toISOString } from '../../../utils/utils';
import instance from '../../../apis/base';
import { toast } from 'react-toastify';
// Component AddShowModal
const AddShowModal: React.FC<{
  onSave: (newShow: Show) => void;
  onClose: () => void;
  show: boolean;
  listHall : Hall[]
  // moviesFromProps: Movie[];
}> = ({
  onSave,
  onClose,
  show,
  listHall
  // moviesFromProps
}) => {
    // State for form data, errors, and success notification
    const [formData, setFormData] = useState<Show>({
      id: '',
      movieTitle: '',
      genres: [], // Mảng genre khởi tạo rỗng
      listHall: [], // Mảng listHall khởi tạo rỗng
      movieRuntimeMinutes: 0,
      moviePosterImage: '',
      ageRating: 0,
      movieId: '',
    });
    const [formHallData, setFormHallData] = useState<ListHall>({
      hallId:'',
      hallName: '',
      listTime: [
        {
          startTime: '',
          showTimes: [{
            time: '',
            showId: ''
          }],
        },
      ]
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie>();
    const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertVariant, setAlertVariant] = useState<string>('success');


    const [startTime, setStartime] = useState('')
    const [dataStart, setDataStart] = useState('')
    const [idMovie, setIdMovie] = useState('')
    const [idHall, setIdHall] = useState('')


    useEffect(() => {
      const fetchMovies = async () => {
        try {
          const response: MovieResponse = await getAllTitleMovies();
          setCurrentMovies(response.items); // Lưu danh sách phim vào trạng thái
        } catch (error) {
          setAlertMessage('Có lỗi xảy ra khi lấy danh sách phim.');
          setAlertVariant('danger');
        }
      };

      fetchMovies();
    }, []);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { id, value } = e.target;
    
      if (id === "showTime") {
        
        console.log(value);

        setFormHallData((prev) => ({
          ...prev,
          listHall: [
            {listTime: [
              {showTimes: [
                 {time: value}
              ]}
            ]}
          ]
        }));
      }

      if (id === 'startTime') {
        console.log(value);
        
        // Cập nhật startTime trong formHallData.listTime
        setFormHallData((prev) => ({
          ...prev,
          listTime: prev.listTime.map((item, index) =>
            index === 0 ? { ...item, startTime: value } : item // Cập nhật startTime phần tử đầu tiên
          ),
        }));
    
        // Đồng bộ listHall trong formData
        setFormData((prev) => ({
          ...prev,
          listHall: [
            {
              ...formHallData,
              listTime: formHallData.listTime.map((item, index) =>
                index === 0 ? { ...item, startTime: value } : item
              ),
            },
          ],
        }));
      } else if (id === 'hallName') {
        setFormHallData((prev) => ({
          ...prev,
          [id]: value,
        }));
    
        setFormData((prev) => ({
          ...prev,
          listHall: [
            {
              ...formHallData,
              [id]: value,
            },
          ],
        }));
      } else {

        setFormData((prev) => ({
          ...prev,
          [id]: id === 'ticketPrice' || id === 'duration' ? Number(value) : value,
        }));
      }
    };
    

    // Validate form
    const validateForm = () => {
      const newErrors: { [key: string]: string } = {};
      const today = new Date().toISOString().split('T')[0];

      if (!formData.movieTitle) {
        newErrors.movieName = 'Tên phim không được để trống';
      }

      if (!formData.listHall.some(hall =>
        hall.listTime.some(time => time.startTime.trim() !== '')
      )) {
        newErrors.showDate = 'Ngày suất chiếu không được để trống';
      } else if (!formData.listHall.some(hall =>
        hall.listTime.some(time => new Date(time.startTime) >= new Date(today))
      )) {
        newErrors.showDate = 'Ngày suất chiếu phải là ngày trong tương lai';
      }

      if (!formData.listHall.some(hall =>
        hall.listTime.some(time =>
          time.showTimes.some(show => show.time.trim() !== '')
        ))) {
        newErrors.showTime = 'Suất chiếu không được để trống';
      }

      if (!formData.movieRuntimeMinutes || formData.movieRuntimeMinutes <= 0) {
        newErrors.duration = 'Thời lượng phải lớn hơn 0';
      }

      // if (formData.ticketPrice <= 0) {
      //   newErrors.ticketPrice = 'Giá vé phải là số dương';
      // }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    const handleSave = () => {
      if (validateForm()) {
        const updatedFormData = {
          ...formData,
          movieId: selectedMovie, // Thêm movieId vào formData
          hallId: listHall,

        };
        onSave(updatedFormData);
        setSuccessMessage('Thêm suất chiếu thành công!');
        setTimeout(() => {
          setSuccessMessage(null); // Ẩn thông báo thành công
          onClose(); // Đóng modal
        }, 3000);
      }
    };


    // Hide modal if not required to show
    if (!show) {
      return null;
    }
    const handleMovieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedMovieId = e.target.value;
      console.log(1111);
      
      const selectedMovie = currentMovies.find((movie) => movie.id === selectedMovieId);
      console.log( 'sss:',selectedMovie);
      
      setIdMovie(selectedMovieId)// Lưu movieId được chọn
      setSelectedMovie(selectedMovie)
    };


    const handleSubmit = async () => {
      const payload = {
        "movieId": idMovie,
        "startTime": toISOString(dataStart, startTime),
        "cinemaHallId": idHall
      }

      const res = await instance.post('movie-management-module/Shows', payload)

      if (res.status  === 200) {
        onClose()
        toast.success('Thêm suất thành công!')
      } else {
        toast.error("Thêm suất thất bại!")
      }
    }
    
    return (
      <div className="modal show d-block" tabIndex={-1} aria-labelledby="addShowModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addShowModalLabel">Thêm suất chiếu</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {/* Success message */}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form>
                {/* Form fields */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="movieName" className="form-label">Tên Phim</label>
                    <select
                      id="movieName"
                      className={`form-select ${errors.movieName ? 'is-invalid' : ''}`}
                      // value={selectedMovie}
                      onChange={handleMovieChange}
                    >
                      <option value="">-- Chọn phim --</option> {/* Option mặc định */}
                      {currentMovies.length > 0 ? (
                        currentMovies.map((movie) => (
                          <option key={movie.id} value={movie.id}>
                            {movie.title}
                          </option>
                        ))
                      ) : (
                        <option disabled>Không có phim để chọn</option>
                      )}
                    </select>
                    {errors.movieName && <div className="invalid-feedback">{errors.movieName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="posterUrl" className="form-label">Poster URL</label>
                    <input
                      type="text"
                      id="posterUrl"
                      className="form-control"
                      value={selectedMovie?.posterImage}
                      readOnly // Không cho phép người dùng chỉnh sửa URL
                    />
                    {/* Hiển thị poster phim nếu có */}
                    {selectedMovie?.posterImage && (
                      <img
                        src={selectedMovie?.posterImage}
                        alt={`Poster của ${selectedMovie?.posterImage}`}
                        className="mt-3"
                        width="200"
                      />
                    )}
                  </div>
                </div>
                {/* Other form fields */}
                {/* Ngày suất chiếu, Phòng chiếu */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="startTime" className="form-label">Ngày suất chiếu</label>
                    <input
                      type="date"
                      id="startTime"
                      className={`form-control ${errors.showDate ? 'is-invalid' : ''}`}
                      // value={formData.showDate}
                      // value={
                      //   formHallData.listTime.map(a=>a.startTime)
                      // }
                      onChange={(e) => setDataStart(e.target.value)}
                    />
                    {errors.showDate && <div className="invalid-feedback">{errors.showDate}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="screeningRoom" className="form-label">Phòng chiếu</label>
                    <select
                      id="screeningRoom"
                      className="form-select"
                      // value={formData.listHall.map(a=>a.hallName)}
                      onChange={(e) => setIdHall(e.target.value)}
                    >
                      {listHall.map(a=> <option key={a.name} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Thời lượng, Suất chiếu */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="duration" className="form-label">Thời lượng (Phút)</label>
                    <input
                      type="number"
                      id="duration"
                      className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                      value={selectedMovie?.runtimeMinutes}
                      readOnly
                    />
                    {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="showTime" className="form-label">Suất chiếu</label>
                    <input
                      type="time"
                      id="showTime"
                      className={`form-control ${errors.showTime ? 'is-invalid' : ''}`}
                      // value={formData.showTime}
                      // value={
                      //   formData.listHall.length > 0 &&
                      //     formData.listHall[0].listTime.length > 0 &&
                      //     formData.listHall[0].listTime[0].showTimes.length > 0
                      //     ? formData.listHall[0].listTime[0].showTimes[0].time
                      //     : ''
                      // }
                      onChange={(e) => setStartime(e.target.value)}
                    />
                    {errors.showTime && <div className="invalid-feedback">{errors.showTime}</div>}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>Thêm Suất Chiếu</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AddShowModal;
