import React, { useEffect, useState } from "react";
import { DirectorDTO } from "../../../models/movieDto";
import * as bootstrap from "bootstrap";

interface EditDirectorModalProps {
  directorId: number | null; // ID của đạo diễn đang chỉnh sửa
  directors: DirectorDTO[]; // Danh sách các đạo diễn
  onSave: (updatedDirector: DirectorDTO) => void; // Hàm để lưu đạo diễn đã chỉnh sửa
}

const EditDirectorModal: React.FC<EditDirectorModalProps> = ({ directorId, directors, onSave }) => {
  const [director, setDirector] = useState<DirectorDTO | null>(null);
  const [directorName, setDirectorName] = useState<string>("");

  useEffect(() => {
    if (directorId !== null) {
      const foundDirector = directors.find((d) => d.id === directorId);
      setDirector(foundDirector || null);
      setDirectorName(foundDirector?.name || "");
    }
  }, [directorId, directors]);

  const handleSave = () => {
    if (directorName.trim() === "") {
      alert("Tên đạo diễn không được để trống.");
      return;
    }

    const updatedDirector: DirectorDTO = {
      id: directorId!, // ID của đạo diễn đang chỉnh sửa
      name: directorName,
    };

    onSave(updatedDirector); // Gọi hàm onSave với đạo diễn đã chỉnh sửa

    const modalElement = document.getElementById("editDirectorModal");
    const modal = modalElement ? new bootstrap.Modal(modalElement) : null;
    modal?.hide(); // Đóng modal sau khi lưu
  };

  if (!director) {
    return null; // Nếu không tìm thấy đạo diễn, không render gì cả
  }

  return (
    <div className="modal fade" id="editDirectorModal" tabIndex={-1} aria-labelledby="editDirectorModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editDirectorModalLabel">Chỉnh sửa Đạo Diễn</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="directorNameEdit" className="form-label">Tên Đạo Diễn</label>
                <input
                  type="text"
                  className="form-control"
                  id="directorNameEdit"
                  value={directorName}
                  onChange={(e) => setDirectorName(e.target.value)} // Cập nhật state khi thay đổi
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

export default EditDirectorModal;
