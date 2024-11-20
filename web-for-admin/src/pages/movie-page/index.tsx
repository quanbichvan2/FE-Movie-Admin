import React, { useState, useEffect } from "react";
import { Movie, MovieDetail, MovieResponse } from "../../models/movieDto";
import { getAllMovies, createMovie, updateMovie } from "../../services/movieService"; // Import hàm gọi API
import { Pagination, getLastPage, getVisibleResultsMax, getVisibleResultsMin } from "@workday/canvas-kit-react/pagination";
import ListActor from "../../components/actor/listActor";
import ListDirector from "../../components/director/listDirector";
import { Alert, Button } from 'react-bootstrap';
import { getAllGenres } from "../../services/genreService"; // Nhập hàm lấy danh sách thể loại
import { getDirectorsForChoice } from "../../services/directorService"; // Nhập hàm lấy danh sách đạo diễn
import { getCastMembersForChoice } from "../../services/actorService"; // Nhập hàm lấy danh sách diễn viên
import MovieModal from "../../components/modals/movies/MovieModal"; // Nhập MovieModal
import AgeRating from "../../components/modals/movies/ageRating";
import { Genre, GenreResponse } from "../../models/genreDto";
import { director, directorResponse } from "../../models/directorDto";
import { CastMember, CastMembersResponse } from "../../models/castMemberDto";
import { getById } from "../../services/movieService"; // Nhập hàm getById


import "../../assets/vendors/iconly/bold.css";
import "../../assets/css/app.css";
import "../../assets/css/bootstrap.css";
import "../../assets/vendors/perfect-scrollbar/perfect-scrollbar.css";
import "../../assets/vendors/bootstrap-icons/bootstrap-icons.css";
import "../../assets/vendors/perfect-scrollbar/perfect-scrollbar.min.js";


const MovieTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const resultCount = 5; // Số lượng phim hiển thị mỗi trang
  const [currentMovies, setCurrentMovies] = useState<Movie[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [directors, setDirectors] = useState<director[]>([]);
  const [actors, setActors] = useState<CastMember[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<string>('success');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const [selectedActors, setSelectedActors] = useState<CastMember[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const genresData: GenreResponse = await getAllGenres();
        const directorsData: directorResponse = await getDirectorsForChoice();
        const actorsData: CastMembersResponse = await getCastMembersForChoice();

        setGenres(genresData.items);
        setDirectors(directorsData.items);
        setActors(actorsData.items);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAllData();
  }, []);

  // Tự động ẩn alert sau 3 giây
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [alertMessage]);

  // Hàm lấy danh sách phim
  const fetchMovies = async (pageIndex: number) => {
    try {
      const response: MovieResponse = await getAllMovies(pageIndex, resultCount);
      setCurrentMovies(response.items);
      setTotalCount(response.totalCount);
    } catch (error) {
      setAlertMessage('Có lỗi xảy ra khi lấy danh sách phim.');
      setAlertVariant('danger');
    }
  };

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Định dạng dd/mm/yyyy
  };

  // Gọi hàm fetchMovies khi component render hoặc currentPage thay đổi
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const lastPage = getLastPage(resultCount, totalCount);
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenModal = async (movie: Movie | null, isEditing: boolean) => {
    if (movie) {
      try {
        // Chỉ gọi API khi cần thông tin chi tiết
        const movieData: MovieDetail = await getById(movie.id);
        setMovieData(movieData);
        setSelectedActors(movieData.castMembers); // Không có lỗi chính tả
        setSelectedGenres(movieData.genres);

      } catch (error) {
        setAlertMessage('Không thể lấy thông tin phim.');
        setAlertVariant('danger');
        return;
      }
    } else {
      setMovieData(null);
      setSelectedActors([]);
      setSelectedGenres([]);
    }
    setIsEditing(isEditing);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const filteredMovies = currentMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSubmit = async () => {
    try {
      const currentMovieData: Movie = {
        id: movieData?.id || '',
        directorName: movieData?.directorName || '',
        genres: movieData?.genres || [],
        castMembers: movieData?.castMembers || [],
        title: movieData?.title || '',
        ageRating: movieData?.ageRating || 0,
        runtimeMinutes: movieData?.runtimeMinutes || 0,
        releaseDate: movieData?.releaseDate || '', // Chuyển đổi null thành chuỗi rỗng
        trailerLink: movieData?.trailerLink || '',
        bannerText: movieData?.bannerText || '',
        headerImage: movieData?.headerImage || '',
        posterImage: movieData?.posterImage || '',
        description: movieData?.description || '',
        directorId: movieData?.directorId || '',
      };

      if (currentMovieData.id) {
        // Cập nhật phim
        await updateMovie(currentMovieData.id, {
          ...currentMovieData,
          releaseDate: currentMovieData.releaseDate || '', // Đảm bảo releaseDate là chuỗi
          genres: selectedGenres,
          castMembers: selectedActors,
        });
        setAlertVariant('success');
        setAlertMessage('Cập nhật phim thành công!');

      } else {
        // Thêm phim mới
        await createMovie({
          ...currentMovieData,
          releaseDate: currentMovieData.releaseDate || '', // Đảm bảo releaseDate là chuỗi
          genres: selectedGenres,
          castMembers: selectedActors,
        });
        setAlertVariant('success');
        setAlertMessage('Thêm phim thành công!');
      }

      handleCloseModal();
      fetchMovies(currentPage);
    } catch (error) {
      setAlertVariant('danger');
      setAlertMessage('Có lỗi xảy ra khi thực hiện yêu cầu.');

      console.error(error);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h3>Quản lý Phim</h3>
      </div>
      <div className="page-content">
        <section className="row">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Quản lý Phim</h4>
                <button className="btn btn-success mb-3" onClick={() => handleOpenModal(null, false)}>
                  Thêm phim
                </button>
              </div>
              <div className="card-body">
                {alertMessage && (
                  <Alert
                    variant={alertVariant}
                    onClose={() => setAlertMessage(null)}
                    dismissible
                    style={{
                      position: 'fixed',
                      top: '20px',
                      right: '20px',
                      zIndex: 1050,
                      width: '300px',
                    }}
                  >
                    {alertMessage}
                  </Alert>
                )}
                <div className="mb-3">
                  <input
                    type="text"
                    id="searchFilm"
                    className="form-control"
                    placeholder="Tìm kiếm phim..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Ảnh</th>
                        <th>Tên Phim</th>
                        <th>Thể Loại</th>
                        <th>Age Rating</th>
                        <th>Ngày Công chiếu</th>
                        <th>Thời lượng</th>
                        <th>Hoạt Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                          <tr key={movie.id}>
                            <td>
                              <img
                                style={{ width: "180px", height: "270px", objectFit: "cover", borderRadius: "8px" }}
                                src={movie.headerImage}
                                alt={`Poster phim ${movie.title}`}
                                width="auto"
                              />
                            </td>
                            <td>{movie.title}</td>
                            <td>
                              {movie.genres.map((genre) => genre.name.replace("Thể loại phim", "").trim()).join(',\n ')}
                            </td>

                            <td className=""><AgeRating ageRating={movie.ageRating} /></td>
                            <td>{formatReleaseDate(movie.releaseDate ?? "")}</td>
                            <td>{movie.runtimeMinutes} phút</td>
                            <td className="controllmovie">
                              {/* <Link to="/show-page/" className="btn btn-outline-primary gap-btn">
                                Suất chiếu
                              </Link> */}
                              <Button 
                              variant="btn btn-outline-primary gap-btn" 
                              className="m-2" 
                              href={'/show-page/' + movie.id}>
                              Suất chiếu
                              </Button>
                              <button
                                type="button"
                                className="btn btn-outline-info gap-btn"
                                onClick={() => handleOpenModal(movie, true)}
                              >
                                Sửa
                              </button>
                              <a className="btn btn-outline-danger gap-btn">Dừng chiếu</a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center">
                            Không tìm thấy phim.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  onPageChange={handlePageChange}
                  aria-label="Pagination"
                  lastPage={lastPage}
                >
                  <Pagination.Controls>
                    <Pagination.JumpToFirstButton aria-label="First" />
                    <Pagination.StepToPreviousButton aria-label="Previous" />
                    <Pagination.PageList>
                      {({ state }: any) =>
                        state.range.map((pageNumber: number) => (
                          <Pagination.PageListItem key={pageNumber}>
                            <Pagination.PageButton
                              aria-label={`Page ${pageNumber}`}
                              pageNumber={pageNumber}
                            />
                          </Pagination.PageListItem>
                        ))
                      }
                    </Pagination.PageList>
                    <Pagination.StepToNextButton aria-label="Next" />
                    <Pagination.JumpToLastButton aria-label="Last" />
                  </Pagination.Controls>
                  <Pagination.AdditionalDetails shouldHideDetails>
                    {({ state }: any) =>
                      `${getVisibleResultsMin(state.currentPage, resultCount)}-${getVisibleResultsMax(
                        state.currentPage,
                        resultCount,
                        totalCount
                      )} của ${totalCount} kết quả`
                    }
                  </Pagination.AdditionalDetails>
                </Pagination>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Gọi MovieModal */}
      <MovieModal
        isEditing={isEditing}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        movieData={movieData} // movieData giờ đây chứa thông tin chi tiết
        directors={directors}
        actors={actors}
        genres={genres}
        selectedActors={selectedActors}
        handleChange={(e) => {
          const { name, value } = e.target;
          setMovieData((prevData) => {
            const newMovieData: Movie = {
              id: '',
              directorName: '',
              genres: [],
              castMembers: [],
              title: '',
              ageRating: 0,
              runtimeMinutes: 0,
              releaseDate: null,
              trailerLink: '',
              bannerText: '',
              headerImage: '',
              posterImage: '',
              description: '',
              directorId: '',
              ...prevData,
              [name]: name === 'runtimeMinutes' ? Number(value) : value, // Chỉ spread nếu prevData không phải null
            };

            return { ...newMovieData, [name]: value };
          });
        }}
        handleActorChange={(e) => {
          const actorId = e.target.value;
          if (!selectedActors.some(actor => actor.id === actorId)) {
            const selectedActor = actors.find(actor => actor.id === actorId);
            if (selectedActor) {
              setSelectedActors((prevActors) => [...prevActors, selectedActor]);
            }
          }
        }}
        removeActor={(actorId) => {
          setSelectedActors((prevActors) => prevActors.filter(actor => actor.id !== actorId));
        }}
        handleGenreChange={(e) => {
          const genreId = e.target.value;
          if (!selectedGenres.some(genre => genre.id === genreId)) {
            const selectedGenre = genres.find(genre => genre.id === genreId);
            if (selectedGenre) {
              setSelectedGenres((prevGenres) => [...prevGenres, selectedGenre]);
            }
          }
        }}
        selectedGenres={selectedGenres}
        removeGenre={(genreId) => {
          setSelectedGenres((prevGenres) => prevGenres.filter(genre => genre.id !== genreId));
        }}
      />



      <div className="row">
        <ListActor setAlertMessage={setAlertMessage} setAlertVariant={setAlertVariant} />
        <ListDirector setAlertMessage={setAlertMessage} setAlertVariant={setAlertVariant} />
      </div>
    </>
  );
};

export default MovieTable;