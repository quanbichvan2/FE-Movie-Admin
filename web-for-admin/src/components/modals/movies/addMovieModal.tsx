import React, { useState } from "react";
import { MovieDTO, sampleMovie } from "../../../models/movieDto.tsx";

import { DirectorDTO, ActorDTO } from "../../../models/movieDto";
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from '@mui/material/Alert';

interface AddMovieModalProps {
  onClose: () => void;
  directors: DirectorDTO[];
  actors: ActorDTO[];
  onAddMovie: (newMovie: MovieDTO) => void; // Thêm thuộc tính này vào giao diện
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  onClose,
  directors,
  actors,
  onAddMovie,
}) => {
  const [newMovie, setNewMovie] = useState<MovieDTO>({
    title: "",
    ageRating: "",
    trailerLink: "",
    runtime: 0,
    releaseDate: "",
    status: "",
    genre: "",
    description: "",
    bannerImg: "",
    posterImg: "",
    directorId: 0,
    actorId: [],
  });
  const [selectedActors, setSelectedActors] = useState<
    { id: number; name: string }[]
  >([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewMovie({ ...newMovie, [field]: URL.createObjectURL(file) });
    }
  };

  const handleActorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedActor = actors.find((actor) => actor.id === +e.target.value);
    if (selectedActor) {
      setSelectedActors([...selectedActors, selectedActor]);
      setNewMovie({
        ...newMovie,
        actorId: [...newMovie.actorId, selectedActor.id],
      });
    }
  };

  const removeActor = (id: number) => {
    setSelectedActors(selectedActors.filter((actor) => actor.id !== id));
    setNewMovie({
      ...newMovie,
      actorId: newMovie.actorId.filter((actorId) => actorId !== id),
    });
  };

  const handleSubmit = () => {
    const errors: string[] = [];

    // Validate movie title
      const titleRegex =
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔưăêô ]{2,100}$/;
    if (
      !newMovie.title ||
      newMovie.title.trim().length < 2 ||
      newMovie.title.trim().length > 100
    ) {
      errors.push("Tên phim phải có độ dài từ 2 đến 100 ký tự.");
    } else if (!titleRegex.test(newMovie.title)) {
      errors.push("Tên phim chỉ được chứa chữ cái, khoảng trắng.");
    }

    const today = new Date();
    const releaseDate = new Date(newMovie.releaseDate);
    if (isNaN(releaseDate.getTime()) || releaseDate < today) {
      errors.push("Ngày công chiếu phải ở hiện tại hoặc tương lai.");
    }

    if (newMovie.runtime < 30 || newMovie.runtime > 300) {
      errors.push("Thời lượng phim phải từ 30 đến 300 phút.");
    }

    if (newMovie.description.length <= 50) {
      errors.push("Mô tả phim phải dài hơn 50 ký tự.");
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(newMovie.trailerLink)) {
      errors.push("Link trailer phải là một liên kết YouTube hợp lệ.");
    }

    if (!newMovie.ageRating) {
      errors.push("Độ tuổi cho phép không được để trống.");
    }
    if (!newMovie.status) {
      errors.push("Tình trạng phim không được để trống.");
    }
    if (!newMovie.genre) {
      errors.push("Thể loại phim không được để trống.");
    }
    if (!newMovie.bannerImg) {
      errors.push("Banner phim không được để trống.");
    }
    if (!newMovie.posterImg) {
      errors.push("Poster phim không được để trống.");
    }
    if (!newMovie.actorId) {
        errors.push("Diễn viên không được để trống.");
      }
      if (!newMovie.directorId) {
        errors.push("Đạo diễn phim không được để trống.");
      }

    if (errors.length > 0) {
      <Alert severity="error">{errors.join("\n")}.</Alert>
  } else {
      // Add movie to sampleMovie and call the onAddMovie function
      sampleMovie.push({ ...newMovie, id: sampleMovie.length + 1 });
      onAddMovie({ ...newMovie, id: sampleMovie.length + 1 }); // Add movie to parent component
      console.log("Movie added: ", newMovie);
      onClose(); // Close modal after adding
      <Alert severity="success">Lưu thành công.</Alert>

    }
  };

  return (
    <div
      className="modal fade show"
      style={{ display: "block" }}
      tabIndex={-1}
      aria-labelledby="addMovieModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addMovieModalLabel">
              Thêm phim
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
                  value={newMovie.title}
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
                    value={newMovie.runtime}
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
                    value={newMovie.releaseDate}
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
                    value={newMovie.directorId}
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
                    value={newMovie.ageRating}
                    onChange={handleChange}
                  >
                    <option selected value="P">P</option>
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
                    value={newMovie.status}
                    onChange={handleChange}
                  >
                    <option selected value="Sắp chiếu">Sắp chiếu</option>
                    <option value="Ngừng chiếu">Ngừng chiếu</option>
                  </select>
                </div>
                <div className="col-3">
                  <label htmlFor="genre" className="form-label">
                    Thể Loại
                  </label>
                  <select
                    className="form-select"
                    id="genre"
                    name="genre"
                    value={newMovie.genre}
                    onChange={handleChange}
                  >
                    <option selected value="Hành động">Hành động (Action)</option>
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
                <label htmlFor="actorId" className="form-label">
                  Chọn Diễn Viên
                </label>
                <select
                  className="form-select"
                  id="actorId"
                  onChange={handleActorChange}
                >
                  <option value="">Chọn diễn viên</option>
                  {actors
                    .filter(
                      (actor) =>
                        !selectedActors.some(
                          (selected) => selected.id === actor.id
                        )
                    ) // Filter out selected actors
                    .map((actor) => (
                      <option key={actor.id} value={actor.id}>
                        {actor.name}
                      </option>
                    ))}
                </select>
                <div>
                  {selectedActors.map((actor) => (
                    <span key={actor.id} className="badge bg-secondary m-1">
                      {actor.name}
                      <button
                        className="btn-close btn-close-white ms-2"
                        onClick={() => removeActor(actor.id)}
                      ></button>
                    </span>
                  ))}
                </div>
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
                  value={newMovie.trailerLink}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Mô tả
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={newMovie.description}
                  onChange={handleChange}
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="bannerImg" className="form-label">
                  Banner phim
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
                  Poster phim
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="posterImg"
                  onChange={(e) => handleFileChange(e, "posterImg")}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Thêm phim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovieModal;
