import { AxiosResponse } from "axios";
import { ComboDto } from "../models/comboDto";
import baseUrl from "../apis/base";
import axios from 'axios';
export const BASE_URL = "catalog-module/Combos";


export const getAllCombo = async () => {
    const res = await baseUrl
        .get<ComboDto[]>(`${BASE_URL}`) // Không cần thay đổi dòng này
        .then((response: AxiosResponse) => {
            return response.data ; // Đảm bảo bạn lấy đúng dữ liệu từ response
        })
        .catch((error) => {
            console.log("Error fetching all products:", error);
            return [];
        });
    return res;
};
export const getCombosById = async (id: string | undefined): Promise<ComboDto | null> => {
    if (!id) {
        console.error("ID không được định nghĩa.");
        return null; // Trả về null nếu ID không hợp lệ
    }

    try {
        const response: AxiosResponse<ComboDto> = await axios.get(`https://localhost:7022/catalog-module/Combos/${id}`);
        return response.data; // Giả định rằng API trả về một đối tượng ComboDto
    } catch (error) {
        console.log("Error fetching combo by ID:", error);
        return null; // Trả về null khi có lỗi
    }
};
export const addCombo = async (comboData: ComboDto) => {
    try {
        console.log('Dữ liệu gửi:', {
            ...comboData,
        });
        const token = sessionStorage.getItem('accessToken');
        console.log('Access Token:', token); // Xác minh token có đúng không
        const response = await axios.post(
            'https://localhost:7022/catalog-module/Combos',
            {
                ...comboData,
            },
            {
                headers: {
                     Authorization: `Bearer ${token}`, // Đảm bảo có token hợp lệ
                    "Content-Type": "application/json", // Đặt đúng Content-Type
                },
            }
        );
        return response.data;

    } catch (error) {
        console.error('Lỗi khi thêm món ăn:', error);
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Dữ liệu phản hồi lỗi:', error.response.data);
                console.error('Mã trạng thái:', error.response.status);
            } else if (error.request) {
                console.error('Yêu cầu đã được gửi nhưng không nhận được phản hồi:', error.request);
            } else {
                console.error('Lỗi mạng:', error.message);
            }
        }
        throw error;
    }
};
export const editCombo = async (comboData: ComboDto,id:string): Promise<ComboDto>=> {
    console.log("Dữ liệu combo:", comboData);
    try {
        console.log('Dữ liệu gửi:', {
            ...comboData, ...comboData.products
        });

        const response = await axios.put(
            `https://localhost:7022z/catalog-module/Combos/${id}`,
            {
                ...comboData,
            },
            {
                headers: {
                    // Authorization: `Bearer ${token}`, // Đảm bảo có token hợp lệ
                    "Content-Type": "application/json", // Đặt đúng Content-Type
                },
            }
        );
        return response.data;

    } catch (error) {
        console.error('Lỗi khi cập nhật món ăn:', error);
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error('Dữ liệu phản hồi lỗi:', error.response.data);
                console.error('Mã trạng thái:', error.response.status);
            } else if (error.request) {
                console.error('Yêu cầu đã được gửi nhưng không nhận được phản hồi:', error.request);
            } else {
                console.error('Lỗi mạng:', error.message);
            }
        }
        throw error;
    }
};