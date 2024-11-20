import { Genre } from '../../../models/genreDto';
import { Movie } from '../../../models/movieDto';
import { director } from '../../../models/directorDto';
import { CastMember } from '../../../models/castMemberDto';
import React, { ChangeEvent, useState } from 'react';

interface MovieModalProps {
    isOpen: boolean;
    isEditing: boolean;
    onClose: () => void;
    onSubmit: () => void;
    movieData: Movie | null;
    directors: director[];
    actors: CastMember[];
    selectedActors: CastMember[];
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleActorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    removeActor: (actorId: string) => void;
    genres: Genre[];
    selectedGenres: Genre[];
    handleGenreChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    removeGenre: (Id: string) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    movieData,
    directors,
    actors,
    selectedActors,
    handleChange,
    handleActorChange,
    removeActor,
    genres,
    selectedGenres,
    handleGenreChange,
    removeGenre,
    isEditing
}) => {
    const convertDateToInputFormat = (dateString: string): string => {
        if (!dateString) return ""; // Nếu không có giá trị, trả về chuỗi rỗng

        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error("Invalid date value:", dateString);
            return ""; // Trả về chuỗi rỗng nếu không hợp lệ
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        return `${year}-${month}-${day}`; // Định dạng yyyy-mm-dd cho input type="date"
    };

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedDate = event.target.value; // yyyy-mm-dd
        const [year, month, day] = selectedDate.split('-'); // Tách ngày tháng năm
        const formattedDate = `${year}-${month}-${day}T00:00:00Z`; // Định dạng lại cho ISO

        const syntheticEvent = {
            target: {
                name: event.target.name,
                value: formattedDate,
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;

        handleChange(syntheticEvent); // Gọi hàm handleChange với sự kiện đã chỉnh sửa
    };
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        // const isEditing = movieData !== null; // nếu có giá trị truyền vào là true

        // Validate tên phim
        const titleRegex = /^[\p{L}\s0-9.,!?()'’]+$/u;
        if (!movieData?.title) {
            newErrors.title = "Tên phim không được để trống";
        } else if (!titleRegex.test(movieData.title)) {
            newErrors.title = "Tên phim không được chứa ký tự đặc biệt (trừ dấu câu cơ bản)";
        }

        // Validate đạo diễn
        if (!movieData?.directorId) {
            newErrors.directorId = "Đạo diễn không được để trống";
        }

        // Validate thời gian
        if (!movieData?.runtimeMinutes || movieData.runtimeMinutes <= 30) {
            newErrors.runtimeMinutes = "Thời gian phải lớn hơn 30 phút";
        }

        // Validate ngày công chiếu
        if (!movieData?.releaseDate) {
            newErrors.releaseDate = "Ngày công chiếu không được để trống";
        } else {
            const releaseDate = new Date(movieData.releaseDate);
            const today = new Date();
            delete newErrors.releaseDate 
            console.log(isEditing)
            //khi tạo mới phim thì không được là ngày trong quá khứ
            // tạo mới thì isEditing = false
            if (!isEditing && releaseDate < today) {
                console.log("Release date is in the past");
                newErrors.releaseDate = "Ngày công chiếu không được là ngày trong quá khứ";
            }
        }



        // Validate độ tuổi
        if (!movieData?.ageRating) {
            newErrors.ageRating = "Độ tuổi cho phép không được để trống";
        }

        // Validate diễn viên
        if (selectedActors.length === 0) {
            newErrors.actors = "Phải chọn ít nhất một diễn viên";
        }

        // Validate thể loại
        if (selectedGenres.length === 0) {
            newErrors.genres = "Phải chọn ít nhất một thể loại";
        }

        // Validate link trailer
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!movieData?.trailerLink) {
            newErrors.trailerLink = "Link trailer không được để trống";
        } else if (!youtubeRegex.test(movieData.trailerLink)) {
            newErrors.trailerLink = "Link trailer phải là link YouTube hợp lệ";
        }

        // Validate mô tả
        if (!movieData?.description) {
            newErrors.description = "Mô tả không được để trống";
        }

        // Validate link poster
        if (!movieData?.posterImage) {
            newErrors.posterImage = "Poster phim không được để trống";
        }

        // Validate link banner
        if (!movieData?.headerImage) {
            newErrors.headerImage = "Banner phim không được để trống";
        }

        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSubmit = async () => {
        console.log(movieData)

        // tranfer
        {
        //    if (movieData?.ageRating ) { movieData?.ageRating = Number(movieData?.ageRating)}
        }
        if (!validateForm()) return; // Nếu có lỗi thì không submit
        console.log(movieData);
        try {
            if (movieData) {
                console.log(movieData);

                await onSubmit(); // Gửi dữ liệu đã được validate
            }
        } catch (error) {
        }
    };
    const handleClose = () => {
        setErrors({}); // Reset lỗi
        onClose(); // Gọi hàm onClose truyền vào để đóng modal
    };
    return (
        <div
            className={`modal fade ${isOpen ? 'show' : ''}`}
            style={{ display: isOpen ? 'block' : 'none' }}
            tabIndex={-1}
            aria-labelledby="movieModalLabel"
            aria-hidden={!isOpen}
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="movieModalLabel">
                            {isEditing ? 'Sửa phim' : 'Thêm phim'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3 row">
                                <div className="col-8">
                                    <label htmlFor="title" className="form-label">Tên Phim</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={movieData?.title || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.title && <div className="text-danger">{errors.title}</div>}
                                </div>
                                <div className="col-4">
                                    <label htmlFor="directorId" className="form-label">Đạo diễn</label>
                                    <select
                                        className="form-select"
                                        id="directorId"
                                        name="directorId"
                                        value={movieData?.directorId || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        {directors.map((director) => (
                                            <option key={director.id} value={director.id}>
                                                {director.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.director && <div className="text-danger">{errors.director}</div>}

                                </div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-3">
                                    <label htmlFor="runtimeMinutes" className="form-label">Thời gian (phút)</label>
                                    <input
                                        type="number"
                                        id="runtimeMinutes"
                                        name="runtimeMinutes"
                                        className="form-control"
                                        value={movieData?.runtimeMinutes || ""}
                                        onChange={handleChange}
                                    />
                                    {errors.runtimeMinutes && <div className="text-danger">{errors.runtimeMinutes}</div>}

                                </div>
                                <div className="col-6">
                                    <label htmlFor="releaseDate" className="form-label">Ngày công chiếu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="releaseDate"
                                        name="releaseDate"
                                        value={convertDateToInputFormat(movieData?.releaseDate || '')}
                                        onChange={handleDateChange}
                                    />
                                    {errors.releaseDate && <div className="text-danger">{errors.releaseDate}</div>}

                                </div>
                                <div className="col-3">
                                    <label htmlFor="ageRating" className="form-label">Độ tuổi cho phép</label>
                                    <select
                                        className="form-select"
                                        id="ageRating"
                                        name="ageRating"
                                        value={movieData?.ageRating || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option selected value="1">C</option>
                                        <option value="2">P</option>
                                        <option value="3">C13</option>
                                        <option value="4">C18</option>
                                    </select>
                                    {errors.ageRating && <div className="text-danger">{errors.ageRating}</div>}

                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="actorId" className="form-label">Chọn Diễn Viên</label>
                                <select
                                    className="form-select"
                                    id="actorId"
                                    onChange={handleActorChange}
                                    required
                                >
                                    <option value="">Chọn diễn viên</option>
                                    {actors
                                        .filter(actor =>
                                            selectedActors && Array.isArray(selectedActors) &&
                                            !selectedActors.some(selected => selected.id === actor.id)
                                        )
                                        .map(actor => (
                                            <option key={actor.id} value={actor.id}>
                                                {actor.name}
                                            </option>
                                        ))}
                                </select>

                                <div>
                                    <div>
                                        {selectedActors && Array.isArray(selectedActors) && selectedActors.length > 0 ? (
                                            selectedActors.map(actor => (
                                                <span key={actor.id} className="badge bg-secondary m-1">
                                                    {actor.name}
                                                    <button
                                                        className="btn-close btn-close-white ms-2"
                                                        onClick={() => removeActor(actor.id)}
                                                    ></button>
                                                </span>
                                            ))
                                        ) : (
                                            <p>Chưa có diễn viên nào được chọn</p>
                                        )}
                                    </div>
                                </div>
                                {errors.actor && <div className="text-danger">{errors.actor}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="genreId" className="form-label">Chọn Thể Loại</label>
                                <select
                                    className="form-select"
                                    id="genreId"
                                    name="genres"
                                    onChange={handleGenreChange}
                                    required
                                >
                                    <option value="">Chọn thể loại</option>
                                    {genres
                                        .filter(genre =>
                                            selectedGenres && Array.isArray(selectedGenres) &&
                                            !selectedGenres.some(selected => selected.id === genre.id)
                                        )
                                        .map(genre => (
                                            <option key={genre.id} value={genre.id}>
                                                {genre.name}
                                            </option>
                                        ))}
                                </select>

                                <div>
                                    <div>
                                        {selectedGenres && Array.isArray(selectedGenres) && selectedGenres.length > 0 ? (
                                            selectedGenres.map(genre => (
                                                <span key={genre.id} className="badge bg-secondary m-1">
                                                    {genre.name}
                                                    <button
                                                        className="btn-close btn-close-white ms-2"
                                                        onClick={() => removeGenre(genre.id)}
                                                    ></button>
                                                </span>
                                            ))
                                        ) : (
                                            <p>Chưa có thể loại nào được chọn</p>
                                        )}
                                    </div>
                                </div>
                                {errors.genre && <div className="text-danger">{errors.genre}</div>}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="trailerLink" className="form-label">Link Trailer</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="trailerLink"
                                    name="trailerLink"
                                    value={movieData?.trailerLink || ''}
                                    onChange={handleChange}
                                />
                                {errors.trailerLink && <div className="text-danger">{errors.trailerLink}</div>}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={movieData?.description || ''}
                                    onChange={handleChange}
                                    rows={4}
                                ></textarea>
                                {errors.description && <div className="text-danger">{errors.description}</div>}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="posterImage" className="form-label">Link Poster phim</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="posterImage"
                                    name="posterImage"
                                    value={movieData?.posterImage || ''}
                                    onChange={handleChange}
                                />
                                {errors.posterImage && <div className="text-danger">{errors.posterImage}</div>}

                            </div>
                            <div className="mb-3">
                                <label htmlFor="headerImage" className="form-label">Link Banner phim</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="headerImage"
                                    name="headerImage"
                                    value={movieData?.headerImage || ''}
                                    onChange={handleChange}
                                />
                                {errors.headerImage && <div className="text-danger">{errors.headerImage}</div>}

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieModal;