export interface VoucherDto {
  id?: number;
  code: string;
  description: string;
  startDate: string;
  endDate: string;
  isDiscountPercentage: boolean; // Add this property
  discountValue: number;
}
