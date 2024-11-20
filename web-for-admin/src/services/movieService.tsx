import instance from '../apis/base';
import { MovieResponse, CreateMovieRequest, MovieDetail, UpdateMovieRequest } from '../models/movieDto';

export const getAllMovies = async (pageIndex: number, pageSize: number): Promise<MovieResponse> => {
    try {
        const response = await instance.get('/movie-management-module/Movies', {
            params: {
                PageIndex: pageIndex,
                PageSize: pageSize,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error; 
    }
};
export const getAllTitleMovies = async (): Promise<MovieResponse> => {
    try {
        const response = await instance.get('/movie-management-module/Movies', {
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error; 
    }
};
export const createMovie = async (movieData: CreateMovieRequest): Promise<MovieResponse> => {
    try {
        const response = await instance.post('/movie-management-module/Movies', movieData);
        
        // Kiểm tra mã trạng thái phản hồi
        if (response.status !== 200) {
            throw new Error(`Unexpected response code: ${response.status}`);
        }

        return response.data;
    } catch (error: any) {
        // In lỗi chi tiết hơn nếu có
        console.error('Error creating movie:', error.response?.data || error.message);
        throw error; 
    }
};

export const getById = async (id: string): Promise<MovieDetail> => {
    try {
        const response = await instance.get(`/movie-management-module/Movies/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie by ID:', error);
        throw error; 
    }
};
export const updateMovie = async (id: string, movieData: UpdateMovieRequest): Promise<MovieResponse> => {
    try {
        const response = await instance.put(`/movie-management-module/Movies/${id}`, movieData);
        
        // Kiểm tra mã trạng thái phản hồi
        if (response.status !== 200) {
            throw new Error(`Unexpected response code: ${response.status}`);
        }

        return response.data;
    } catch (error: any) {
        console.error('Error updating movie:', error.response?.data || error.message);
        throw error; 
    }
};