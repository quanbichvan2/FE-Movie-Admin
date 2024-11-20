import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ScreeningRoomDto,
  screeningRoomData,
  SeatRow
} from "../../../models/screeningRoomDto"; // Đường dẫn chính xác tới file
import { Alert } from 'react-bootstrap';

interface EditRoomModalProps {
  roomId: number;
  onClose: () => void;
}
const EditRoomModal: React.FC<EditRoomModalProps> = ({ roomId, onClose }) => {
  const [roomData, setRoomData] = useState<ScreeningRoomDto | null>();
  const [rows, setRows] = useState<number>(10); // Số hàng khởi tạo
  const [columns, setColumns] = useState<number>(15); // Số cột khởi tạo
  const [seatDiagram, setSeatDiagram] = useState<SeatRow[]>([]); // Lưu sơ đồ ghế
  const [vipCount, setVipCount] = useState<number>(0); // Số ghế VIP
  const [coupleCount, setCoupleCount] = useState<number>(0); // Số ghế đôi
  const [totalSeats, setTotalSeats] = useState<number>(0);
  const [errors, setErrors] = useState<any>({});
  const [roomName, setRoomName] = useState<string>('');
  const [alertVisible, setAlertVisible] = useState(false); // State cho thông báo

  useEffect(() => {
    const room = screeningRoomData.find((r) => r.id === roomId);
    if (room) {
      setRoomData(room);
      setRows(room.rows);
      setColumns(room.columns);
      setRoomName(room.name);
      // Chuẩn hóa dữ liệu seatdiagram từ JSON
      const normalizedSeatDiagram = room.seatdiagram.map((row) => ({
        row: row.row,
        seats: row.seats.map((seat) => ({
          seatNumber: seat.seatNumber,
          type: seat.type as 'regular' | 'vip' | 'couple', // Chuyển đổi kiểu type
        })),
      }));

      setSeatDiagram(normalizedSeatDiagram); // Lưu vào state
      calculateCounts(normalizedSeatDiagram); // Tính số lượng ghế ban đầu


    }
  }, [roomId]);
  useEffect(() => {
    if (seatDiagram.length === 0) return; // Chỉ chạy khi đã có dữ liệu seatDiagram ban đầu

    const updatedSeatDiagram = [...seatDiagram];

    // Nếu số hàng tăng, thêm hàng mới
    if (updatedSeatDiagram.length < rows) {
      for (let i = updatedSeatDiagram.length; i < rows; i++) {
        updatedSeatDiagram.push({
          row: String.fromCharCode(65 + i), // Tạo tên hàng từ A, B, C, ...
          seats: Array.from({ length: columns }, (_, j) => ({
            seatNumber: `${String.fromCharCode(65 + i)}${j + 1}`,
            type: 'regular',
          })),
        });
      }
    } else if (updatedSeatDiagram.length > rows) {
      // Nếu số hàng giảm, xóa bớt hàng
      updatedSeatDiagram.splice(rows);
    }

    // Cập nhật số lượng cột cho mỗi hàng
    updatedSeatDiagram.forEach((row, rowIndex) => {
      if (row.seats.length < columns) {
        for (let j = row.seats.length; j < columns; j++) {
          row.seats.push({
            seatNumber: `${String.fromCharCode(65 + rowIndex)}${j + 1}`,
            type: 'regular',
          });
        }
      } else if (row.seats.length > columns) {
        row.seats.splice(columns);
      }
    });

    setSeatDiagram(updatedSeatDiagram); // Cập nhật sơ đồ ghế mới
    calculateCounts(updatedSeatDiagram); // Cập nhật lại số ghế
  }, [rows, columns]);
  const calculateCounts = (seatDiagram: SeatRow[]) => {
    let vip = 0;
    let couple = 0;

    seatDiagram.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.type === 'vip') {
          vip += 1;
        } else if (seat.type === 'couple') {
          couple += 1;
        }
      });
    });

    setVipCount(vip);
    setCoupleCount(couple);

    // Tính toán tổng số ghế dựa trên sơ đồ ghế hiện tại
    const total = seatDiagram.reduce((acc, row) => acc + row.seats.length, 0);
    setTotalSeats(total);
  };
  const handleAddSeat = (rowIndex: number) => {
    const updatedSeatDiagram = [...seatDiagram];
    if (updatedSeatDiagram[rowIndex].seats.length < columns) {
      updatedSeatDiagram[rowIndex].seats.push({
        seatNumber: `${String.fromCharCode(65 + rowIndex)}${updatedSeatDiagram[rowIndex].seats.length + 1}`,
        type: 'regular',
      });
      setSeatDiagram(updatedSeatDiagram);
      calculateCounts(updatedSeatDiagram);
    }
  };
  const handleRemoveSeat = (rowIndex: number) => {
    const updatedSeatDiagram = [...seatDiagram];
    const lastSeat = updatedSeatDiagram[rowIndex].seats[updatedSeatDiagram[rowIndex].seats.length - 1];

    if (lastSeat) {
      if (lastSeat.type === 'couple') {
        // Nếu ghế cuối là ghế đôi, xóa nó và biến ghế bên cạnh thành ghế thường
        updatedSeatDiagram[rowIndex].seats.pop(); // Xóa ghế đôi

        // Chuyển ghế bên cạnh thành ghế thường nếu có
        if (updatedSeatDiagram[rowIndex].seats.length > 0) {
          updatedSeatDiagram[rowIndex].seats[updatedSeatDiagram[rowIndex].seats.length - 1].type = 'regular';
        }
      } else {
        // Nếu ghế cuối là ghế thường, chỉ cần xóa nó
        updatedSeatDiagram[rowIndex].seats.pop();
      }

      setSeatDiagram(updatedSeatDiagram);
      calculateCounts(updatedSeatDiagram); // Cập nhật số ghế
    }

  };
  // Hàm xử lý logic chuyển đổi loại ghế khi click vào ghế
  const handleSeatClick = (rowIndex: number, seatIndex: number) => {
    const updatedSeatDiagram = [...seatDiagram];
    const currentSeat = updatedSeatDiagram[rowIndex].seats[seatIndex];

    if (currentSeat.type === "regular") {
      // Chuyển đổi từ ghế thường sang ghế VIP
      updatedSeatDiagram[rowIndex].seats[seatIndex].type = "vip";
      setVipCount(prev => prev + 1);
    } else if (currentSeat.type === "vip") {
      // Chuyển đổi từ ghế VIP sang ghế đôi
      const adjacentSeat = findAdjacentSeatForCouple(rowIndex, seatIndex);
      if (adjacentSeat) {
        const [adjRow, adjCol] = adjacentSeat;
        updatedSeatDiagram[rowIndex].seats[seatIndex].type = "couple";
        updatedSeatDiagram[adjRow].seats[adjCol].type = "couple";
        setCoupleCount(prev => prev + 1);
        setVipCount(prev => prev - 1); // Giảm số ghế VIP
      }
    } else if (currentSeat.type === "couple") {
      // Nếu ghế đã là ghế đôi, có thể đặt lại ghế thường
      updatedSeatDiagram[rowIndex].seats[seatIndex].type = "regular";
      const adjacentSeat = UnfindAdjacentSeatForCouple(rowIndex, seatIndex);
      if (adjacentSeat) {
        const [adjRow, adjCol] = adjacentSeat;
        updatedSeatDiagram[rowIndex].seats[seatIndex].type = "regular";
        updatedSeatDiagram[adjRow].seats[adjCol].type = "regular";
        setCoupleCount(prev => prev - 1);
      }
    }
    setSeatDiagram(updatedSeatDiagram);
    calculateCounts(updatedSeatDiagram); // Cập nhật số ghế khi có thay đổi
  };
  // Hàm tìm ghế bên cạnh để ghép thành ghế đôi
  const findAdjacentSeatForCouple = (rowIndex: number, seatIndex: number): [number, number] | null => {
    // Kiểm tra ghế bên phải
    if (seatIndex + 1 < columns && seatDiagram[rowIndex].seats[seatIndex + 1].type !== "couple") {
      return [rowIndex, seatIndex + 1];
    }
    // Kiểm tra ghế bên trái
    if (seatIndex - 1 >= 0 && seatDiagram[rowIndex].seats[seatIndex - 1].type !== "couple") {
      return [rowIndex, seatIndex - 1];
    }
    return null; // Không tìm thấy ghế phù hợp
  };
  const UnfindAdjacentSeatForCouple = (rowIndex: number, seatIndex: number): [number, number] | null => {
    // Kiểm tra ghế bên phải
    if (seatIndex + 1 < columns && seatDiagram[rowIndex].seats[seatIndex + 1].type == "couple") {
      return [rowIndex, seatIndex + 1];
    }
    // Kiểm tra ghế bên trái
    if (seatIndex - 1 >= 0 && seatDiagram[rowIndex].seats[seatIndex - 1].type == "couple") {
      return [rowIndex, seatIndex - 1];
    }
    return null; // Không tìm thấy ghế phù hợp
  };
  // Hàm render sơ đồ ghế từ seatDiagram đã cập nhật
  const renderSeatDiagram = () => {
    return seatDiagram.map((row, rowIndex) => (
      <div
        key={rowIndex}
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "8px",
        }}
      >
        <button onClick={() => handleRemoveSeat(rowIndex)} className="btn btn-danger btn-sm" style={{ marginRight: "50px", width: "40px", height: "40px", borderRadius: "20px" }}>-</button>

        {row.seats.map((seat, seatIndex) => (
          <span
            key={`${seat.seatNumber}-${seatIndex}`}
            className="badge m-1"
            style={{
              backgroundColor:
                seat.type === "vip"
                  ? "rgb(245, 34, 45)"
                  : seat.type === "couple"
                    ? "rgb(235, 47, 150)"
                    : "rgb(114, 46, 209)",
              width: "40px",
              height: "40px",
              textAlign: "center",
              lineHeight: "40px",
              cursor: "pointer",
            }}
            onClick={() => handleSeatClick(rowIndex, seatIndex)}
          >
            {seat.type === "couple" ? `${seat.seatNumber}` : seat.seatNumber}
          </span>
        ))}
        <button onClick={() => handleAddSeat(rowIndex)} className="btn btn-success btn-sm" style={{ marginLeft: "50px", width: "40px", height: "40px", borderRadius: "20px" }}>+</button>

      </div>
    ));
  };
  // Hàm xử lý khi thay đổi số hàng
  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRowCount = Math.min(12, Math.max(1, +e.target.value)); // Giới hạn số hàng từ 1 đến 12
    setRows(newRowCount);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(e.target.value); // Cập nhật tên phòng chiếu
  };
  // Hàm xử lý khi thay đổi số cột
  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColCount = Math.min(15, Math.max(1, +e.target.value)); // Giới hạn số cột từ 1 đến 15
    setColumns(newColCount);
  };

  const validate = () => {
    const newErrors: any = {};

    // Kiểm tra tên phòng chiếu (không được rỗng và không có ký tự đặc biệt)
    if (!roomName.trim()) {
      newErrors.roomName = "Tên phòng chiếu không được để trống";
    } else if (!/^[\p{L}\p{N}\s]+$/u.test(roomName)) {
      newErrors.roomName = "Tên phòng chiếu không được chứa ký tự đặc biệt";
    }

    // Kiểm tra số hàng
    if (!rows || isNaN(Number(rows)) || Number(rows) <= 0 || !Number.isInteger(Number(rows))) {
      newErrors.rows = "Hàng phải là số nguyên lớn hơn 0";
    }

    // Kiểm tra số cột
    if (!columns || isNaN(Number(columns)) || Number(columns) <= 0 || !Number.isInteger(Number(columns))) {
      newErrors.columns = "Cột phải là số nguyên lớn hơn 0";
    }

    if (coupleCount % 2 !=0) {
      newErrors.coupleCount = "ghế đôi phải là số chẵn";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Nếu validate thành công, tiến hành submit form
      console.log("Submit form:", { roomName, rows, columns });
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);

      // Đóng modal sau 1 giây
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };
  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-labelledby="editRoomModalLabel" aria-hidden="true">
      <div className="modal-dialog custom-Room-size modal-lg" style={{ width: "100%", maxWidth: "80%", height: "100%", maxHeight: "90%" }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editRoomModalLabel">Chỉnh Sửa Phòng Chiếu</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-3">
                <h6>Thông Tin Phòng Chiếu</h6>
                <form>
                  <div className="mb-3">
                    <label htmlFor="roomCode" className="form-label">Mã Phòng Chiếu</label>
                    <input type="text" className="form-control" id="roomCode" value={roomData?.code || ""} readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roomName" className="form-label">Tên Phòng Chiếu</label>
                    <input type="text" className="form-control" id="roomName" value={roomName} onChange={handleNameChange} />
                    {errors.roomName && <span style={{ color: 'red' }}>{errors.roomName}</span>}
                  </div>
                  <div className="row">
                    <div className="col-3">
                      <label htmlFor="rowNumber" className="form-label">Số Hàng</label>
                      <input type="number" className="form-control" id="rowNumber" value={rows} onChange={handleRowChange} />
                      {errors.rows && <span style={{ color: 'red' }}>{errors.rows}</span>}
                    </div>
                    <div className="col-3">
                      <label htmlFor="columnNumber" className="form-label">Số Cột</label>
                      <input type="number" className="form-control" id="columnNumber" value={columns} onChange={handleColumnChange} />
                      {errors.columns && <span style={{ color: 'red' }}>{errors.columns}</span>}
                    </div>
                    <div className="col-6">
                      <label htmlFor="totalSeats" className="form-label">Tổng Số Ghế</label>
                      <input type="text" className="form-control" id="totalSeats" value={totalSeats} readOnly />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="roomStatus" className="form-label">Trạng Thái</label>
                    <select id="roomStatus" className="form-control" value={roomData?.status || ""}>
                      <option value="active">Hoạt Động</option>
                      <option value="busy">Đang Bận</option>
                      <option value="maintenance">Bảo Trì</option>
                      <option value="inactive">Ngưng Hoạt Động</option>
                    </select>
                  </div>
                  <h6>Loại Ghế Trong Phòng Chiếu</h6>
                  <div className="mb-3">
                    <label htmlFor="seatTypeNormal" className="form-label">Ghế Thường</label>
                    <input type="number" value={totalSeats - vipCount - coupleCount} className="form-control" id="seatTypeNormal" readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="seatTypeVIP" className="form-label">Ghế VIP</label>
                    <input type="number" className="form-control" id="seatTypeVIP" value={vipCount} readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="seatTypeCouple" className="form-label">Ghế Đôi</label>
                    <input type="number" className="form-control" id="seatTypeCouple" value={coupleCount} readOnly />
                  </div>
                  {errors.coupleCount && <span style={{ color: 'red' }}>{errors.coupleCount}</span>}
                </form>
              </div>
              <div className="col-md-9">
                <h6>Sơ Đồ Phòng Chiếu</h6>
                <div id="roomDiagram" className="border p-3" style={{ overflowX: "auto", background: "#222" }}>
                  <div className="text-center mb-3">
                    <div className="py-2" style={{ background: "#fff", width: "100%", maxWidth: "600px", margin: "0 auto" }}>Màn Hình</div>
                  </div>
                  <div className="seat-diagram">{renderSeatDiagram()}</div>
                </div>
                <div className="modal-footer">
                  <button className="badge" style={{ backgroundColor: "rgb(114, 46, 209)", border: "none", width: "40px", height: "40px", display: "inline-block", textAlign: "center", lineHeight: "40px", cursor: "pointer" }}></button> Ghế Thường
                  <button className="badge" style={{ backgroundColor: "rgb(245, 34, 45)", border: "none", width: "40px", height: "40px", display: "inline-block", textAlign: "center", lineHeight: "40px", cursor: "pointer" }}></button> Ghế Vip
                  <button className="badge" style={{ backgroundColor: "rgb(235, 47, 150)", border: "none", width: "40px", height: "40px", display: "inline-block", textAlign: "center", lineHeight: "40px", cursor: "pointer" }}></button> Ghế Đôi
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Lưu Thay Đổi</button>
          </div>
        </div>
      </div>
      <div className="div">
        {alertVisible && (
          <Alert variant="success" style={{ width: "400px", position: "absolute", top: "10px", right: "10px", zIndex: 1000 }}>Lưu thành công!</Alert>
        )}
      </div>
    </div>
  );
  
};
export default EditRoomModal;
