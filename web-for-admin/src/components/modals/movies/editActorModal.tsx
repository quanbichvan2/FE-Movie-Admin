import React, { useState, useEffect } from "react";
import { sampleActors, ActorDTO } from "../../../models/movieDto";
import * as bootstrap from "bootstrap";

interface EditActorModalProps {
  actorId: number | null;
  onSave: (updatedActor: ActorDTO) => void; // Thay đổi onSave để truyền diễn viên đã chỉnh sửa ra ngoài
}
const EditActorModal: React.FC<EditActorModalProps> = ({ actorId, onSave }) => {
  const [actor, setActor] = useState<ActorDTO | null>(null);
  const [actorName, setActorName] = useState<string>(''); // Quản lý trạng thái cho tên diễn viên

  useEffect(() => {
    if (actorId !== null) {
      const foundActor = sampleActors.find((a) => a.id === actorId);
      setActor(foundActor || null);
      setActorName(foundActor?.name || ''); // Đặt tên diễn viên vào state
    }
  }, [actorId]);

  const handleSave = () => {
    if (actorName.trim() === '') {
      alert('Tên diễn viên không được để trống.');
      return;
    }

    const updatedActor: ActorDTO = {
      id: actorId!, // ID của diễn viên đang chỉnh sửa
      name: actorName,
    };

    onSave(updatedActor); // Truyền diễn viên đã cập nhật ra ngoài

    const modalElement = document.getElementById("editActorModal");
    const editModal = modalElement ? new bootstrap.Modal(modalElement) : null;

    if (editModal) {
      editModal.hide(); // Đóng modal sau khi lưu
    }
  };

  if (!actor) {
    return null; // Nếu không tìm thấy diễn viên, không render gì cả
  }

  return (
    <div className="modal fade" id="editActorModal" tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh Sửa Diễn Viên</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="actorName" className="form-label">Tên Diễn Viên</label>
                <input
                  type="text"
                  className="form-control"
                  id="actorName"
                  value={actorName} // Sử dụng state để hiển thị
                  onChange={(e) => setActorName(e.target.value)} // Cập nhật state khi thay đổi
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Lưu Thay Đổi</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditActorModal;
