export interface productDto {
    id: string;
    name: string;
    quantity: number;
    price:number;
}

export interface ComboDto {
    id: string;
    code:string
    name: string;
    price: number;
    image: string;
    Status: string;
    description: string;
    createdBy: string;
    modifiedBy: string;
    createdAt?: Date;
    modifiedAt?: Date;
    products: productDto[]; // Sử dụng mảng để lưu trữ danh sách sản phẩm
    categoryId: string;
}