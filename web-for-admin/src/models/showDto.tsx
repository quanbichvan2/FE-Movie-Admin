    // export interface ShowDto {
    //     id?: number;
    //     movieName: string;
    //     posterUrl: string;
    //     showDate: string;
    //     screeningRoom: string;
    //     duration: number;
    //     showTime: string;
    //     ticketType: 'normal' | 'peak' | 'holiday';
    //     ticketPrice: number;

    // }
    // export interface ShowDto {
    //     id?: number;
    //     movieName: string;
    //     posterUrl: string;
    //     showDate: string;
    //     screeningRoom: string;
    //     duration: number;
    //     showTime: string;
    //     ticketType: 'normal' | 'peak' | 'holiday';
    //     ticketPrice: number;
    // }

    export interface Show {
        id:                  string;
        movieTitle:          string;
        genres:              Genre[];
        listHall:            ListHall[];
        movieRuntimeMinutes: number;
        moviePosterImage:    string;
        ageRating:           number;
        movieId:             string;
      }
      
      export interface Genre {
        id:   string;
        name: string;
      }
      
      export interface ListHall {
        hallId:   string;
        hallName: string;
        listTime: ListTime[];
      }
      export interface ShowTimes{
        showId: string;
        time: string;
      }
      export interface ListTime {
        startTime: string;
        showTimes: ShowTimes[];
      }
      
      
