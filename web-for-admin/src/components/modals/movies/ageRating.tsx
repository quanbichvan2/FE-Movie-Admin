import React from 'react';

interface AgeRatingProps {
  ageRating: number;
}

const AgeRating: React.FC<AgeRatingProps> = ({ ageRating }) => {
  let displayRating: string;

  switch (ageRating) {
    case 0:
      displayRating = 'P'; // Đối với độ tuổi phù hợp cho trẻ em
      break;
    case 1:
      displayRating = 'K'; // Đối với độ tuổi phù hợp cho khán giả
      break;
    case 2:
      displayRating = '13+'; // Đối với độ tuổi 13 trở lên
      break;
    case 3:
      displayRating = '16+'; // Đối với độ tuổi 18 trở lên
      break;
      case 4:
        displayRating = '18+'; // Đối với độ tuổi 18 trở lên
        break;
        case 5:
          displayRating = 'C'; // Đối với độ tuổi 18 trở lên
          break;
    default:
      displayRating = 'Không xác định'; // Nếu không có độ tuổi hợp lệ
      break;
  }

  return (
    <td>{displayRating}</td>
  );
};

export default AgeRating;