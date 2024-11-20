import React, { useState } from "react";
import { DirectorDTO } from "../../../models/movieDto";
import * as bootstrap from "bootstrap";
interface AddDirectorModalProps {
  onSave: (newDirector: DirectorDTO) => void; // Hàm để lưu đạo diễn mới
}

const AddDirectorModal: React.FC<AddDirectorModalProps> = ({ onSave }) => {
  const [directorName, setDirectorName] = useState<string>("");

  const handleSave = () => {
    if (directorName.trim() === "") {
      alert("Tên đạo diễn không được để trống.");
      return;
    }

    const newDirector: DirectorDTO = {
      id: Date.now(), // Tạo ID mới cho đạo diễn
      name: directorName,
    };

    onSave(newDirector); // Gọi hàm onSave với đạo diễn mới
    setDirectorName(""); // Reset giá trị tên đạo diễn

    const modalElement = document.getElementById("addDirectorModal");
    const modal = modalElement ? new bootstrap.Modal(modalElement) : null;
    modal?.hide(); // Đóng modal sau khi lưu
  };

  return (
    <div className="modal fade" id="addDirectorModal" tabIndex={-1} aria-labelledby="addDirectorModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addDirectorModalLabel">Thêm Đạo Diễn</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="directorNameAdd" className="form-label">Tên Đạo Diễn</label>
                <input
                  type="text"
                  className="form-control"
                  id="directorNameAdd"
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)} // Cập nhật state khi thay đổi
                  placeholder="Nhập tên đạo diễn"
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleSave}>Lưu</button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDirectorModal;
