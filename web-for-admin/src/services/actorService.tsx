import instance from '../apis/base';
import { CastMembersResponse } from '../models/castMemberDto';

export const getAllCastMembers = async (pageIndex: number, pageSize: number): Promise<CastMembersResponse> => {
    try {
        const response = await instance.get(`movie-management-module/CastMembers`, {
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
export const getCastMembersForChoice = async (): Promise<CastMembersResponse> => {
    try {
        const response = await instance.get(`movie-management-module/CastMembers?PageSize=999`, {
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
        const response = await instance.post('movie-management-module/CastMembers', 
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


export const getCastMemberById = async (id: string): Promise<CastMembersResponse> => {
    const token = sessionStorage.getItem('accessToken'); // Lấy token từ sessionStorage

    if (!token) {
        throw new Error('No token found. Please log in.');
    }

    try {
        const response = await instance.get(`movie-management-module/CastMembers/${id}`, {
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
            `movie-management-module/CastMembers/${id}`,
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