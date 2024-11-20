import instance from '../apis/base';
import { directorResponse } from '../models/directorDto';

export const getAllDirectors = async (pageIndex: number, pageSize: number): Promise<directorResponse> => {
    try {
        const response = await instance.get(`movie-management-module/Directors`, {
            params: {
                PageIndex: pageIndex,
                PageSize: pageSize, 
                
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cast members:', error);
        throw error;
    }
};
export const getDirectorsForChoice = async (): Promise<directorResponse> => {
    try {
        const response = await instance.get(`movie-management-module/Directors?PageSize=999`, {

        });
        return response.data;
    } catch (error) {
        console.error('Error fetching cast members:', error);
        throw error;
    }
};
interface AddActorResponse {
    id: string; // ID của diễn viên mới được thêm
}

export const addCastMember = async (name: string): Promise<AddActorResponse> => {
    const token = sessionStorage.getItem('accessToken');
    console.log('Access Token:', token); // Xác minh token có đúng không
    if (!token) {
        throw new Error('No token found. Please log in.');
    }
    
    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    try {
        const response = await instance.post('movie-management-module/Directors', 
            { name }, // Dữ liệu cần gửi
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token vào header
                    'Content-Type': 'application/json', // Định dạng nội dung là JSON
                },
            }
        );

        return response.data; // Trả về ID của diễn viên mới
    } catch (error) {
        console.error('Error adding cast member:', error);
        throw error;
    }
};


export const getCastMemberById = async (id: string): Promise<directorResponse> => {
    const token = sessionStorage.getItem('accessToken'); // Lấy token từ sessionStorage

    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    try {
        const response = await instance.get(`movie-management-module/Directors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Đính kèm token vào header
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Trả về thông tin của diễn viên
    } catch (error) {
        console.error('Error fetching cast member by ID:', error);
        throw error;
    }
};
export const updateCastMember = async (id: string, name: string): Promise<boolean> => {
    const token = sessionStorage.getItem('accessToken'); // Lấy token từ sessionStorage

    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    try {
        const response = await instance.put(
            `movie-management-module/Directors/${id}`,
            { name }, // Dữ liệu cần gửi
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token vào header
                    'Content-Type': 'application/json-patch+json', // Định dạng nội dung là JSON-Patch
                },
            }
        );

        return response.data; // Trả về kết quả cập nhật (true/false)
    } catch (error) {
        console.error('Error updating cast member:', error);
        throw error;
    }
};