import instance from "../apis/base";
import { GenreResponse } from "../models/genrenDto";

export const getAllGenres = async (pageIndex: number = 1, pageSize: number = 99): Promise<GenreResponse> => {
    try {
      const response = await instance.get('/movie-management-module/Genres', {
        params: {
          PageIndex: pageIndex,
          PageSize: pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error; // Đẩy lỗi lên để có thể xử lý ở nơi khác
    }
  };
  export const getGenreById = async (id: string): Promise<GenreResponse> => {
    try {
      const response = await instance.get(`/movie-management-module/Genres/${id}`, {
        headers: {
          'Authorization': `Bearer YOUR_ACCESS_TOKEN`, // Thay thế bằng token của bạn
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching genre by ID:', error);
      throw error; // Đẩy lỗi lên để có thể xử lý ở nơi khác
    }
  };