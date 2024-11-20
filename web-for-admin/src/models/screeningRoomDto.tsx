export interface Seat {
  seatNumber: string;
  type: string;
}
export interface SeatRow {
  row: string;
  seats: Seat[];
}
export interface ScreeningRoomDto {
  id: number;
  code: string;
  name: string;
  rows: number;
  columns: number;
  totalSeats: number;
  status: string;
  regular: number;
  vipCount: number;
  coupleCount: number;
  seatdiagram: { row: string; seats: Seat[] }[];
}

import seatDiagram from "../assets/seatDiagram.json";

export const screeningRoomData: ScreeningRoomDto[] = [
  {
    id: 1,
    code: "P01",
    name: "Phòng chiếu 01",
    rows: 10,
    columns: 15,
    totalSeats: 150,
    status: "active",
    regular: 130,
    vipCount: 6,
    coupleCount: 7,
    seatdiagram: seatDiagram, // Gán dữ liệu từ JSON vào đây
  },
  {
    id: 2,
    code: "P02",
    name: "Phòng chiếu 02",
    rows: 8,
    columns: 12,
    totalSeats: 96,
    status: "active",
    regular: 76,
    vipCount: 10,
    coupleCount: 5,
    seatdiagram: seatDiagram, // Dữ liệu giả lập
  },
  // Các phòng chiếu khác...
];
// SeatDTO.ts
export interface SeatDTO {
  code: string;
  name: string;
  price: number;
}

export const sampleSeats: SeatDTO[] = [
  { code: 'CVIP01', name: 'Ghế VIP 01', price: 200000 },
  { code: 'CNRM01', name: 'Ghế Thường 01', price: 100000 },
  { code: 'CCPL01', name: 'Ghế Đôi 01', price: 300000 },
];
