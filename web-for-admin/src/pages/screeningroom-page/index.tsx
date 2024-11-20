import React, { useState } from "react";
import {
  ScreeningRoomDto,
  screeningRoomData,
} from "../../models/screeningRoomDto";
import EditRoomModal from "../../components/modals/screeningRoom/editRoomModal"; // Đường dẫn tới EditRoomModal
import SeatList from "../../components/seat/listSeat"; // Đường dẫn tới EditRoomModal

const ScreeningRoomPage: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditRoom = (roomId: number) => {
    setSelectedRoomId(roomId);
    setShowModal(true); // Hiển thị modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoomId(null); // Đặt lại ID phòng chiếu sau khi đóng modal
  };



  return (
    <>
      <div className="page-heading">
        <h3>Quản lý Phòng Chiếu</h3>
      </div>
      <div className="page-content">
        {/* Section Quản lý Phòng Chiếu */}
        <section className="row">
          <div className="col-12 col-lg-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h4>Quản lý Phòng Chiếu</h4>
                <a href="#" className="btn btn-outline-success">
                  Thuê phòng chiếu
                </a>
              </div>
              <div className="card-body">
                {/* Thanh tìm kiếm phòng chiếu */}
              

                {/* Danh sách phòng chiếu */}
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã phòng chiếu</th>
                        <th>Tên Phòng Chiếu</th>
                        <th>Số Hàng</th>
                        <th>Số Cột</th>
                        <th>Tổng Số Ghế</th>
                        <th>Trạng Thái</th>
                        <th>Hoạt Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {screeningRoomData.length > 0 ? (
                        screeningRoomData.map((room: ScreeningRoomDto) => (
                          <tr key={room.id}>
                            <td>{room.code}</td>
                            <td>{room.name}</td>
                            <td>{room.rows}</td>
                            <td>{room.columns}</td>
                            <td>{room.totalSeats}</td>
                            <td>
                              <a href="#" className="btn btn-success">
                                Đang rãnh
                              </a>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-info"
                                onClick={() => handleEditRoom(room.id)} // Hiển thị modal chỉnh sửa
                              >
                                Chỉnh Sửa Phòng
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7}>
                            Không tìm thấy phòng chiếu phù hợp
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {showModal && selectedRoomId !== null && (
                  <EditRoomModal
                    roomId={selectedRoomId}
                    onClose={handleCloseModal}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
       <SeatList />
    </>
  );
};

export default ScreeningRoomPage;
