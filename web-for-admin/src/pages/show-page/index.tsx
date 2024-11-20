import React, { useEffect, useState } from 'react';
import AddShowModal from '../../components/modals/show/addShowModal';
import AddShowToExistingMovieModal from '../../components/modals/show/addedShowModal';
import EditShowModal from '../../components/modals/show/editShowModal';
// import { ShowDto } from '../../models/showDto';
import instance from '../../apis/base';
import { ListHall, Show } from '../../models/showDto';
import '../../assets/css/pages/showPage.css'
import { Movie } from '../../models/movieDto';
import { Hall } from '../../models/hallDto';
export interface PaginationRes {
  items: Show[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


// const halls : Hall[]  = [
//   {
//     "id": "7a8d4dea-15dd-4cdd-ad10-0ae010106891",
//     "cinemaName": "7 Anh Em Cinema",
//     "totalSeat": 100,
//     "name": "Rạp 1"
//   },
//   {
//     "id": "7a8d4dea-15dd-4cdd-ad10-0ae010106892",
//     "cinemaName": "7 Anh Em Cinema",
//     "totalSeat": 100,
//     "name": "Rạp 2"
//   }
// ]


/**
 * Trang quản lý suất chiếu
 */
const ScheduleManagement: React.FC = () => {
  const [show, setShow] = useState<Show[]>([]);
  const [showItem, setShowItem] = useState<Show>();
  const [editShow, setEditShow] = useState<Show | null>(null);
  const [selectedMovieName, setSelectedMovieName] = useState<Show | null>(null);
  const [isAddShowModalOpen, setIsAddShowModalOpen] = useState<boolean>(false); // Mở modal thêm suất chiếu cho phim mới
  const [isAddShowToExistingModalOpen, setIsAddShowToExistingModalOpen] = useState<boolean>(false); // Mở modal thêm suất chiếu cho phim đã có
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showMovie,setMovies] = useState<Movie[]>([]);
  const [halls, setHalls] = useState<Hall[]>([])

  console.log(show);
  

  const handleAddShow = (newShow: Show) => {
    setShowItem(newShow);
    setIsAddShowModalOpen(false);  // Đóng modal sau khi thêm suất chiếu thành công
  };
  const handleShowModal = (newShow: Show) => {
    setSelectedMovieName(newShow)
    setIsAddShowToExistingModalOpen(true);
  }


  useEffect(() => {
    const fetch = async () => {
      const response = await instance.get('movie-management-module/Shows')
        .then(
          (data) => data.data.items
        )
      setShow(response);
    };
    fetch();
  }, []);
  useEffect(() => {
    const fetch = async () => {
      const response = await instance.get('movie-management-module/Halls')
      .then(
        (data) => data.data
      )
      setHalls(response);
    };
    fetch();
  }, []);
  console.log(show);
  // const handleUpdateShow = (updatedShow: Show) => {
  //   const showDetail = show.find((showItem) => showItem.movieId === updatedShow.movieId);

  //   if (showDetail) {
  //     setShow([showDetail]); // Gán showDetail vào một mảng để tương thích với kiểu Item[]
  //   } else {
  //     console.warn("Không tìm thấy suất chiếu với movieId này");
  //   }
  // };
  const handleUpdateShow = (updatedShow: Show) => {
    const updatedShows = show.map((showItem) => 
      showItem.movieId === updatedShow.movieId ? updatedShow : showItem
    );
    setShow(updatedShows);
  };
  const filteredShows = show.filter((item) =>
    item.movieTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="mb-3">
        <a href="#" className="burger-btn d-block d-xl-none">
          <i className="bi bi-justify fs-3"></i>
        </a>
      </header>

      <div className="page-heading">
        <h3>Quản lý Suất Chiếu</h3>
      </div>

      <div className="page-content">
        <section className="row mt-5">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Quản lý Suất Chiếu</h4>
                <a
                  href="#"
                  className="btn btn-outline-success"
                  onClick={() => setIsAddShowModalOpen(true)}  // Mở modal thêm suất chiếu cho phim mới
                >
                  Thêm Suất
                </a>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="searchSchedule">Tìm kiếm:</label>
                    <input
                      type="text"
                      id="searchSchedule"
                      className="form-control"
                      placeholder="Tìm kiếm phim..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="fromDate">Từ Ngày:</label>
                    <input type="date" id="fromDate" className="form-control" />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="toDate">Đến Ngày:</label>
                    <input type="date" id="toDate" className="form-control" />
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tên Phim</th>
                        <th>Suất Chiếu</th>
                        <th>Hoạt Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Nhóm suất chiếu theo tên phim để tránh trùng lặp */}
                      {Array.from(new Set(filteredShows.map(item => item.movieTitle))) // Lấy danh sách tên phim duy nhất
                        .map((movieTitle) => {
                          const filteredMovies = filteredShows.filter(s => s.movieTitle === movieTitle); // Lọc suất chiếu theo tên phim
                          const movieName = filteredMovies[0]; // Lấy thông tin cơ bản của phim từ phần tử đầu tiên của mảng đã lọc
                          console.log(movieName);

                          return (
                            <tr key={movieName.movieId}>
                              <td>
                                <img src={movieName.moviePosterImage} alt="Poster phim" width="100" />
                                {/* API để lấy ảnh poster chưa có */}
                              </td>
                              <td className="col-2">{movieName.movieTitle}</td>
                              <td className="col-6">
                                {/* Hiển thị các suất chiếu cho từng phim, sử dụng Flexbox */}
                                <div className="showtimes-container">
                                  {movieName.listHall.map((s) => (
                                    <div key={s.hallId} className="showtime-item-container">
                                      {s.listTime.map(a => (
                                        a.showTimes.map((b, index) => (
                                          <div
                                            key={index}
                                            className="showtime-item"
                                            onClick={() => setEditShow({
                                              id: movieName.movieId, // ID của Show
                                              movieTitle: movieName.movieTitle, // Tên phim
                                              genres: movieName.genres, // Thể loại
                                              listHall: [s], // Mảng Hall hiện tại
                                              movieRuntimeMinutes: movieName.movieRuntimeMinutes, // Thời gian
                                              moviePosterImage: movieName.moviePosterImage, // Poster
                                              ageRating: movieName.ageRating, // Độ tuổi
                                              movieId: movieName.movieId // ID của phim
                                            })}
                                          >
                                            <div className="showtime-info">
                                              {b.time} | {a.startTime} | {s.hallName}
                                            </div>
                                          </div>
                                        ))
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="col-3">
                                {/* Button để thêm suất chiếu cho phim đã có */}
                                <a
                                  // href="#"
                                  className="btn btn-outline-success"
                                  onClick={() => handleShowModal(movieName)}
                                >
                                  Thêm Suất Chiếu
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section >
      </div >

      {/* Modal thêm suất chiếu cho phim mới */}
      < AddShowModal
        listHall = {halls}
        show={isAddShowModalOpen}  // Đóng modal khi thêm suất chiếu cho phim mới
        onSave={(newShow) => handleAddShow(newShow)}
        onClose={() => setIsAddShowModalOpen(false)}  // Đóng modal sau khi thêm suất chiếu cho phim mới
        // moviesFromProps={movies}
      />
      {/* Modal thêm suất chiếu cho phim đã có */}
      {
        isAddShowToExistingModalOpen && selectedMovieName && (
          <AddShowToExistingMovieModal
            movieName={selectedMovieName}
            // onSave={() => handleAddShowToExistingMovie(selectedMovieName)}
            onSave={() => handleAddShow(selectedMovieName)}
            onClose={() => setIsAddShowToExistingModalOpen(false)}
          // Đóng modal sau khi thêm suất chiếu cho phim đã có
          />
        )
      }

      {/* Modal cập nhật suất chiếu */}
      {
        editShow && (
          <EditShowModal
            show={editShow}
            onSave={(updatedShow) => setEditShow(updatedShow)}
            onClose={() => setEditShow(null)}  // Đóng modal sau khi cập nhật
          />
        )
      }
    </>
  );
};

export default ScheduleManagement;