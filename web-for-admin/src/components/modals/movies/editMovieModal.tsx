import React, { useEffect, useState } from "react";
import { MovieDTO, sampleMovie } from "../../../models/movieDto.tsx";
import { DirectorDTO, ActorDTO } from "../../../models/movieDto";

interface EditMovieModalProps {
  onClose: () => void;
  directors: DirectorDTO[];
  actors: ActorDTO[];
  onEditMovie: (updatedMovie: MovieDTO) => void; 
  movieId: number; 
}

const EditMovieModal: React.FC<EditMovieModalProps> = ({
  onClose,
  directors,
  actors,
  onEditMovie,
  movieId,
}) => {
  const [movie, setMovie] = useState<MovieDTO | null>(null);

  const [selectedActors, setSelectedActors] = useState<
    { id: number; name: string }[]
  >([]);

  // Tìm phim cần sửa từ sampleMovie và thiết lập trạng thái
 useEffect(() => {
    // Lấy thông tin phim dựa vào movieId
    const selectedMovie = sampleMovie.find((m) => m.id === movieId);
    if (selectedMovie) {
      setMovie(selectedMovie);
    }
  }, [movieId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (movie) {
      setMovie({ ...movie, [name]: value });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (movie) {
        setMovie({ ...movie, [field]: URL.createObjectURL(file) });
      }
    }
  };

  const handleActorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedActor = actors.find((actor) => actor.id === +e.target.value);
    if (selectedActor) {
      setSelectedActors([...selectedActors, selectedActor]);
      if (movie) {
        setMovie({
          ...movie,
          actorId: [...movie.actorId, selectedActor.id],
        });
      }
    }
  };

  const removeActor = (id: number) => {
    setSelectedActors(selectedActors.filter((actor) => actor.id !== id));
    if (movie) {
      setMovie({
        ...movie,
        actorId: movie.actorId.filter((actorId) => actorId !== id),
      });
    }
  };

  const handleSubmit = () => {
    const errors: string[] = [];

    if (movie) {
      // Validate movie title
      const titleRegex =
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔưăêô ]{2,100}$/;
      if (
        !movie.title ||
        movie.title.trim().length < 2 ||
        movie.title.trim().length > 100
      ) {
        errors.push("Tên phim phải có độ dài từ 2 đến 100 ký tự.");
      } else if (!titleRegex.test(movie.title)) {
        errors.push("Tên phim chỉ được chứa chữ cái, khoảng trắng.");
      }

      const today = new Date();
      const releaseDate = new Date(movie.releaseDate);
      if (isNaN(releaseDate.getTime()) || releaseDate < today) {
        errors.push("Ngày công chiếu phải ở hiện tại hoặc tương lai.");
      }

      if (movie.runtime < 30 || movie.runtime > 300) {
        errors.push("Thời lượng phim phải từ 30 đến 300 phút.");
      }

      if (movie.description.length <= 50) {
        errors.push("Mô tả phim phải dài hơn 50 ký tự.");
      }

      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
      if (!youtubeRegex.test(movie.trailerLink)) {
        errors.push("Link trailer phải là một liên kết YouTube hợp lệ.");
      }

      if (!movie.ageRating) {
        errors.push("Độ tuổi cho phép không được để trống.");
      }
      if (!movie.status) {
        errors.push("Tình trạng phim không được để trống.");
      }
      if (!movie.genre) {
        errors.push("Thể loại phim không được để trống.");
      }
      if (!movie.bannerImg) {
        errors.push("Banner phim không được để trống.");
      }
      if (!movie.posterImg) {
        errors.push("Poster phim không được để trống.");
      }
      if (!movie.actorId.length) {
        errors.push("Diễn viên không được để trống.");
      }
      if (!movie.directorId) {
        errors.push("Đạo diễn phim không được để trống.");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
      } else {
        // Update movie in sampleMovie and call the onEditMovie function
        const index = sampleMovie.findIndex((m) => m.id === movieId);
        if (index !== -1) {
          sampleMovie[index] = { ...movie };
          onEditMovie({ ...movie });
          console.log("Movie updated: ", movie);
          onClose(); // Close modal after editing
        }
      }
    }
  };

  if (!movie) return null; // Chờ cho đến khi có thông tin phim

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex={-1}
      aria-labelledby="editMovieModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editMovieModalLabel">
              Sửa phim
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Tên Phim
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={movie.title}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3 row">
                <div className="col-6">
                  <label htmlFor="runtime" className="form-label">
                    Thời lượng (Phút)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="runtime"
                    name="runtime"
                    value={movie.runtime}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-6 ">
                  <label htmlFor="releaseDate" className="form-label">
                    Ngày công chiếu
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="releaseDate"
                    name="releaseDate"
                    value={movie.releaseDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mb-3 row">
                <div className="col-3">
                  <label htmlFor="directorId" className="form-label">
                    Đạo diễn
                  </label>
                  <select
                    className="form-select"
                    id="directorId"
                    name="directorId"
                    value={movie.directorId}
                    onChange={handleChange}
                  >
                    {directors.map((director) => (
                      <option key={director.id} value={director.id}>
                        {director.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-3">
                  <label htmlFor="ageRating" className="form-label">
                    Độ tuổi cho phép
                  </label>
                  <select
                    className="form-select"
                    id="ageRating"
                    name="ageRating"
                    value={movie.ageRating}
                    onChange={handleChange}
                  >
                    <option selected value="P">
                      P
                    </option>
                    <option value="C13">C13</option>
                    <option value="C16">C16</option>
                    <option value="C18">C18</option>
                  </select>
                </div>
                <div className="col-3">
                  <label htmlFor="status" className="form-label">
                    Tình trạng
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={movie.status}
                    onChange={handleChange}
                  >
                    <option selected value="Đang chiếu">
                      Đang chiếu
                    </option>
                    <option value="Sắp chiếu">Sắp chiếu</option>
                  </select>
                </div>
                <div className="col-3">
                  <label htmlFor="genre" className="form-label">
                    Thể loại
                  </label>
                  <select
                    className="form-select"
                    id="genre"
                    name="genre"
                    value={movie.genre}
                    onChange={handleChange}
                  >
                    <option value="Hành động">Hành động (Action)</option>
                    <option value="Kinh dị">Kinh dị (Horror)</option>
                    <option value="Hài">Hài (Comedy)</option>
                    <option value="Tâm lý">Tâm lý (Drama)</option>
                    <option value="Lãng mạn">Lãng mạn (Romance)</option>
                    <option value="Khoa học viễn tưởng">
                      Khoa học viễn tưởng (Science Fiction)
                    </option>
                    <option value="Phiêu lưu">Phiêu lưu (Adventure)</option>
                    <option value="Hoạt hình">Hoạt hình (Animation)</option>
                    <option value="Tài liệu">Tài liệu (Documentary)</option>
                    <option value="Chiến tranh">Chiến tranh (War)</option>
                    <option value="Tội phạm">Tội phạm (Crime)</option>
                    <option value="Giả tưởng">Giả tưởng (Fantasy)</option>
                    <option value="Kinh điển">Kinh điển (Classic)</option>
                    <option value="Âm nhạc">Âm nhạc (Musical)</option>
                    <option value="Viễn Tây">Viễn Tây (Western)</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="actors" className="form-label">
                  Diễn viên
                </label>
                <select
                  className="form-select"
                  id="actors"
                  onChange={handleActorChange}
                >
                  <option value="">Chọn diễn viên</option>
                  {actors.map((actor) => (
                    <option key={actor.id} value={actor.id}>
                      {actor.name}
                    </option>
                  ))}
                </select>
                <div className="selected-actors">
                  {selectedActors.map((actor) => (
                    <span key={actor.id} className="actor-tag">
                      {actor.name}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeActor(actor.id)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Mô tả
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={3}
                  value={movie.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="trailerLink" className="form-label">
                  Link Trailer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="trailerLink"
                  name="trailerLink"
                  value={movie.trailerLink}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bannerImg" className="form-label">
                  Banner
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="bannerImg"
                  onChange={(e) => handleFileChange(e, "bannerImg")}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="posterImg" className="form-label">
                  Poster
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="posterImg"
                  onChange={(e) => handleFileChange(e, "posterImg")}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMovieModal;
