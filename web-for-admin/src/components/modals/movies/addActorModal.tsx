import React, { useState } from 'react';
import { ActorDTO, sampleActors  } from '../../../models/movieDto'; // Import ActorDTO từ tệp đúng

interface AddActorModalProps {
    onSave: (newActor: ActorDTO) => void; // Truyền diễn viên mới ra ngoài khi lưu
}

const AddActorModal: React.FC<AddActorModalProps> = ({ onSave }) => {
    const [actorName, setActorName] = useState<string>(''); // Quản lý trạng thái cho tên diễn viên

    const handleSave = () => {
        if (actorName.trim() === '') {
            alert('Tên diễn viên không được để trống.');
            return;
        }

        const newActor: ActorDTO = {
            id: sampleActors.length + 1, // Sử dụng id duy nhất dựa trên thời gian
            name: actorName
        };

        onSave(newActor); // Truyền diễn viên ra ngoài khi lưu thành công

        setActorName(''); // Reset input sau khi lưu
    };

    return (
        <div className="modal fade" id="addActorModal" tabIndex={-1} aria-labelledby="addActorModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="addActorModalLabel">Thêm Diễn Viên</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="actorNameAdd" className="form-label">Tên Diễn Viên</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="actorNameAdd"
                                    value={actorName}
                                    onChange={(e) => setActorName(e.target.value)} // Cập nhật tên diễn viên khi thay đổi
                                    placeholder="Nhập tên diễn viên"
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

export default AddActorModal;
