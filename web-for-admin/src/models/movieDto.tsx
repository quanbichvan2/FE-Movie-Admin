import { CastMember } from "./castMemberDto";
import { Genre } from "./genreDto";

export interface Movie {
  id: string;
  directorName: string;
  genres: Genre[];
  title: string;
  ageRating: number;
  runtimeMinutes: number;
  releaseDate: string | null; // Có thể là null nếu không có ngày phát hành
  trailerLink: string;
  bannerText: string;
  headerImage: string;
  posterImage: string;
  description: string;
  directorId: string;
  castMembers: CastMember[]; // Thay đổi kiểu thành mảng CastMember

}

export interface MovieResponse {
  items: Movie[];
  pageIndex: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateMovieRequest {
  title: string;
  ageRating: number;
  runtimeMinutes: number;
  releaseDate: string;
  trailerLink: string;
  bannerText: string;
  headerImage: string;
  posterImage: string;
  description: string;
  directorId: string;
  castMembers: CastMember[]; // Thay đổi kiểu thành mảng CastMember
  genres: {
    id: string;
  }[];
}

export interface MovieDetail {
  id: string;
  title: string;
  ageRating: number;
  runtimeMinutes: number;
  releaseDate: string; // ISO date string
  trailerLink: string;
  bannerText: string;
  headerImage: string;
  posterImage: string;
  description: string;
  directorId: string;
  directorName: string;
  castMembers: CastMember[];
  genres: Genre[];
}

export interface UpdateMovieRequest {
  title: string;
  ageRating: number;
  runtimeMinutes: number;
  releaseDate: string; // ISO date string
  trailerLink: string;
  bannerText: string;
  headerImage: string;
  posterImage: string;
  description: string;
  directorId: string;
  castMembers: { id: string }[]; // Giữ nguyên định nghĩa
  genres: { id: string }[]; // Giữ nguyên định nghĩa
}