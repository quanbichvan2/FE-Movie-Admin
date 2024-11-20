import { AxiosResponse } from "axios";
import { productDto } from "../models/productDto";
import baseUrl from "../apis/base";
import axios from 'axios';
export const BASE_URL = "catalog-module/Products";
export const getAllProducts = async () => {
    const res = await baseUrl
        .get<productDto[]>(`${BASE_URL}`) // Không cần thay đổi dòng này
        .then((response: AxiosResponse) => {
            console.log("Dữ liệu từ API:", response.data);
            return response.data; // Đảm bảo bạn lấy đúng dữ liệu từ response
        })
        .catch((error) => {
            console.log("Error fetching all products:", error);
            return [];
        });
    return res;
};

export const addFood = async (foodData: productDto) => {
    try {
        console.log('Dữ liệu gửi:', {
            ...foodData,
           // categoryId: '1a5310dc-61b0-42fe-bbed-e5ed3475002d', // ID cho món ăn
        });
        const token = sessionStorage.getItem('accessToken');
        console.log('Access Token:', token); // Xác minh token có đúng không
        const response = await axios.post(
            'https://localhost:7022/catalog-module/Products', foodData,
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
export interface ApiResponse {
    items: productDto[];   // Mảng sản phẩm
    pageIndex: number;      // Chỉ số trang hiện tại
    totalPages: number;     // Tổng số trang
    totalCount: number;     // Tổng số sản phẩm
    pageSize: number;       // Kích thước mỗi trang
    hasPreviousPage: boolean; // Có trang trước hay không
    hasNextPage: boolean;    // Có trang tiếp theo hay không
}

// Cập nhật hàm getProductsByCategory
export const getProductsByCategoryabc = async (categoryId: string): Promise<ApiResponse> => {
    try {
        // Gọi API với categoryId làm tham số tìm kiếm
        const response = await axios.get(`https://localhost:7022/catalog-module/Products?PageSize=9999&SearchTerm=${categoryId}`);

        // Kiểm tra dữ liệu trả về từ API
        if (response.data && response.data.items) {
            // Nếu có trường items trong dữ liệu trả về, gán lại ApiResponse
            const apiResponse: ApiResponse = {
                items: response.data.items,       // Mảng sản phẩm
                pageIndex: response.data.pageIndex, // Chỉ số trang hiện tại
                totalPages: response.data.totalPages, // Tổng số trang
                totalCount: response.data.totalCount, // Tổng số sản phẩm
                pageSize: response.data.pageSize,   // Kích thước trang
                hasPreviousPage: response.data.hasPreviousPage,
                hasNextPage: response.data.hasNextPage
            };
            return apiResponse;
        } else {
            throw new Error('Dữ liệu trả về không hợp lệ');
        }
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

export const addDrink = async (drinkData: productDto) => {
    try {
        console.log('Dữ liệu gửi:', {
            ...drinkData,
        });
        const token = sessionStorage.getItem('accessToken');
        console.log('Access Token:', token); // Xác minh token có đúng không
        const response = await axios.post(
            'https://localhost:7022/catalog-module/Products', drinkData,
                // categoryId: '1a5310dc-61b0-42fe-bbed-e5ed3475002f', // ID cho đồ uống
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đảm bảo có token hợp lệ
                    "Content-Type": "application/json", // Đặt đúng Content-Type
                },
            }
        );
        console.log(response);
        
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thêm đồ uống:', error);
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
export const editFood = async (foodId: string, foodData: productDto) => {
    try {
        // Kiểm tra xem foodId và foodData có hợp lệ không
        if (!foodId) {
            throw new Error("foodId không hợp lệ");
        }
        if (!foodData) {
            throw new Error("foodData không hợp lệ");
        }
        const token = sessionStorage.getItem('accessToken');
        console.log('Access Token:', token); // Xác minh token có đúng không
        console.log("Sửa đổi món ăn:", foodId);
        //console.log("Category ID:", foodData.category_id);
        console.log("Dữ liệu món ăn:", foodData);

        const response = await axios.put<productDto>(
            `https://localhost:7022/catalog-module/Products/${foodId}`,
            { ...foodData },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi Axios:", error.message);
            console.error("Dữ liệu phản hồi:", error.response ? error.response.data : 'Không có dữ liệu');
        } else {
            console.error("Lỗi không phải Axios:", error);
        }
        // Trả về hoặc ném lỗi nếu cần thiết
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
export const editDrink = async (drinkId: string, drinkData: productDto): Promise<productDto | undefined> => {
    try {
        // Kiểm tra dữ liệu đầu vào
        if (!drinkId || !drinkData) {
            throw new Error("drinkId hoặc drinkData không hợp lệ");
        }

        console.log("Bắt đầu sửa đổi thức uống:", drinkId);
        console.log("Category ID:", drinkData.categoryId);
        console.log("Dữ liệu thức uống:", drinkData);

        const response = await axios.put<productDto>(
            `http://localhost:7022/catalog-module/Products/${drinkId}`,
            { ...drinkData },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Lỗi Axios:", error.message);
            console.error("Dữ liệu phản hồi:", error.response ? error.response.data : 'Không có dữ liệu');
        } else {
            console.error("Lỗi không phải Axios:", error);
        }
        throw error; // Ném lỗi để xử lý ở nơi gọi
    }
};
export const getIdPriceByName = async (productName: string) => {
    try {
        // Gọi API để lấy dữ liệu sản phẩm dựa vào tên
        const response = await axios.get(`${baseUrl}/Products`, {
            params: { name: productName }
        });

        // Kiểm tra nếu API trả về dữ liệu thành công
        if (response.data && response.data.product) {
            const product = response.data.product;
            return {
                id: product.id,
                price: product.price
            };
        } else {
            throw new Error("Không tìm thấy sản phẩm.");
        }
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error; // Ném lỗi để xử lý bên ngoài
    }
};