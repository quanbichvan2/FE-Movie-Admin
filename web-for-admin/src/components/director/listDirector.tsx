import { useEffect, useState } from "react";
import { Pagination, getLastPage, getVisibleResultsMax, getVisibleResultsMin } from "@workday/canvas-kit-react/pagination";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllDirectors, addCastMember, updateCastMember } from '../../services/directorService'; // Sửa đổi đường dẫn import
import { director, directorResponse } from "../../models/directorDto"; // Import DTO cho đạo diễn

interface ListDirectorProps {
    setAlertMessage: (message: string | null) => void;
    setAlertVariant: (variant: string) => void;
}

const ListDirector: React.FC<ListDirectorProps> = ({ setAlertMessage, setAlertVariant }) => {
    const resultCount = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDirectorId, setSelectedDirectorId] = useState<string | null>(null);
    const [directorName, setDirectorName] = useState<string>('');
    const [directors, setDirectors] = useState<director[]>([]); // Đổi thành director[]
    const [totalCount, setTotalCount] = useState(0);

    const fetchDirectors = async (pageIndex: number) => {
        try {
            const response: directorResponse = await getAllDirectors(pageIndex, resultCount);
            setDirectors(response.items); // Giữ nguyên đây vì response.items chứa danh sách đạo diễn
            setTotalCount(response.totalCount);
        } catch (error) {
            console.error("Failed to fetch directors:", error);
            setAlertMessage('Không thể tải danh sách đạo diễn.');
            setAlertVariant('danger');
        }
    };

    useEffect(() => {
        fetchDirectors(currentPage);
    }, [currentPage]);

    const handleEditClick = (directorId: string, name: string) => {
        setSelectedDirectorId(directorId);
        setDirectorName(name);
        const modalElement = document.getElementById("directorModal");
        if (modalElement) {
            const editModal = new bootstrap.Modal(modalElement);
            editModal.show();
        } else {
            console.error("Không tìm thấy phần tử modal với ID directorModal");
        }
    };

    const handleAddClick = () => {
        setSelectedDirectorId(null);
        setDirectorName('');
        const modalElement = document.getElementById("directorModal");
        if (modalElement) {
            const addModal = new bootstrap.Modal(modalElement);
            addModal.show();
        }
    };

    const validateDirectorName = (name: string) => {
        if (!name.trim()) {
            return "Tên đạo diễn không được để trống.";
        }

        const regex = /^[\p{L}\p{N}\s]*$/u;
        if (!regex.test(name)) {
            return "Tên đạo diễn không được chứa ký tự đặc biệt.";
        }

        return null;
    };

    const handleSaveDirector = async () => {
        const validationError = validateDirectorName(directorName);
        if (validationError) {
            setAlertMessage(validationError);
            setAlertVariant('danger');
            return;
        }

        try {
            if (selectedDirectorId) {
                await updateCastMember(selectedDirectorId, directorName); // Giữ nguyên tên hàm
                setAlertMessage('Cập nhật đạo diễn thành công!');
                setAlertVariant('success');
            } else {
                const newDirector = await addCastMember(directorName); // Giữ nguyên tên hàm
                setDirectors((prevDirectors) => [...prevDirectors, { id: newDirector.id, name: directorName }]);
                setAlertMessage('Thêm đạo diễn thành công!');
                setAlertVariant('success');
            }
            fetchDirectors(currentPage);
        } catch (error) {
            console.error("Failed to save director:", error);
            setAlertMessage('Thất bại! Không thể lưu đạo diễn.');
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
                        <h4>Danh Sách Đạo Diễn</h4>
                        <button
                            className="btn btn-outline-success"
                            onClick={handleAddClick}
                        >
                            Thêm Đạo Diễn
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên Đạo Diễn</th>
                                        <th>Hoạt Động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {directors.map((director) => (
                                        <tr key={director.id}>
                                            <td>{(currentPage - 1) * resultCount + directors.indexOf(director) + 1}</td>
                                            <td>{director.name}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-info"
                                                    onClick={() => handleEditClick(director.id, director.name)}
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

            {/* Modal thêm/chỉnh sửa đạo diễn */}
            <div className="modal fade" id="directorModal" tabIndex={-1} aria-labelledby="directorModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="directorModalLabel">{selectedDirectorId ? 'Chỉnh Sửa Đạo Diễn' : 'Thêm Đạo Diễn'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="directorName" className="form-label">Tên Đạo Diễn</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="directorName"
                                        placeholder="Nhập tên đạo diễn"
                                        value={directorName}
                                        onChange={(e) => setDirectorName(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleSaveDirector} data-bs-dismiss="modal">Lưu</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ListDirector;