import { useEffect, useState } from "react";
import { Pagination, getLastPage, getVisibleResultsMax, getVisibleResultsMin } from "@workday/canvas-kit-react/pagination";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllCastMembers, addCastMember, updateCastMember } from '../../services/actorService';
import { CastMember } from "../../models/castMemberDto.tsx";

interface ListActorProps {
    setAlertMessage: (message: string | null) => void;
    setAlertVariant: (variant: string) => void;
}

const ListActor: React.FC<ListActorProps> = ({ setAlertMessage, setAlertVariant }) => {
    const resultCount = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
    const [actorName, setActorName] = useState<string>('');
    const [actors, setActors] = useState<CastMember[]>([]);
    const [totalCount, setTotalCount] = useState(0);

    const fetchActors = async (pageIndex: number) => {
        try {
            const response = await getAllCastMembers(pageIndex, resultCount);
            setActors(response.items);
            setTotalCount(response.totalCount);
        } catch (error) {
            console.error("Failed to fetch actors:", error);
            setAlertMessage('Không thể tải danh sách diễn viên.');
            setAlertVariant('danger');
        }
    };

    useEffect(() => {
        fetchActors(currentPage);
    }, [currentPage]);

    const handleEditClick = (actorId: string, name: string) => {
        setSelectedActorId(actorId);
        setActorName(name);
        const modalElement = document.getElementById("actorModal");
        if (modalElement) {
            const editModal = new bootstrap.Modal(modalElement);
            editModal.show();
        } else {
            console.error("Không tìm thấy phần tử modal với ID actorModal");
        }
    };

    const handleAddClick = () => {
        setSelectedActorId(null);
        setActorName('');
        const modalElement = document.getElementById("actorModal");
        if (modalElement) {
            const addModal = new bootstrap.Modal(modalElement);
            addModal.show();
        }
    };

    const validateActorName = (name: string) => {
        if (!name.trim()) {
            return "Tên diễn viên không được để trống.";
        }

        const regex = /^[\p{L}\p{N}\s]*$/u;
        if (!regex.test(name)) {
            return "Tên diễn viên không được chứa ký tự đặc biệt.";
        }

        return null;
    };

    const handleSaveActor = async () => {
        const validationError = validateActorName(actorName);
        if (validationError) {
            setAlertMessage(validationError);
            setAlertVariant('danger');
            return;
        }

        try {
            if (selectedActorId) {
                await updateCastMember(selectedActorId, actorName);
                setAlertMessage('Cập nhật diễn viên thành công!');
                setAlertVariant('success');
            } else {
                const newActor = await addCastMember(actorName);
                setActors((prevActors) => [...prevActors, { id: newActor.id, name: actorName }]);
                setAlertMessage('Thêm diễn viên thành công!');
                setAlertVariant('success');
            }
            fetchActors(currentPage);
        } catch (error) {
            console.error("Failed to save actor:", error);
            setAlertMessage('Thất bại! Không thể lưu diễn viên.');
            setAlertVariant('danger');
        }
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const lastPage = getLastPage(resultCount, totalCount);

    return (
        <>
            <div className="col-12 col-lg-6">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h4>Danh Sách Diễn Viên</h4>
                        <button
                            className="btn btn-outline-success"
                            onClick={handleAddClick}
                        >
                            Thêm Diễn Viên
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên Diễn Viên</th>
                                        <th>Hoạt Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {actors.map((actor, index) => (
                                        <tr key={actor.id}>
                                            <td>{(currentPage - 1) * resultCount + index + 1}</td>
                                            <td>{actor.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-info"
                                                    onClick={() => handleEditClick(actor.id, actor.name)}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
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
                                    {({ state }) =>
                                        state.range.map((pageNumber) => (
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
                                {({ state }) =>
                                    `${getVisibleResultsMin(
                                        state.currentPage,
                                        resultCount
                                    )}-${getVisibleResultsMax(
                                        state.currentPage,
                                        resultCount,
                                        totalCount
                                    )} of ${totalCount} results`
                                }
                            </Pagination.AdditionalDetails>
                        </Pagination>
                    </div>
                </div>
            </div>

            {/* Modal thêm/chỉnh sửa diễn viên */}
            <div className="modal fade" id="actorModal" tabIndex={-1} aria-labelledby="actorModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="actorModalLabel">{selectedActorId ? 'Chỉnh Sửa Diễn Viên' : 'Thêm Diễn Viên'}</h5>
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
                                        placeholder="Nhập tên diễn viên"
                                        value={actorName}
                                        onChange={(e) => setActorName(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSaveActor} data-bs-dismiss="modal">Lưu</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListActor;