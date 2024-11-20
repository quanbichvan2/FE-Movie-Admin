export interface OrderDto {
    id: string,
    date: string,
    paymentAmount?: number,
    movieDescription?: string,
    movieImage?: string,
    totalAmount?: number,
    createBy?: string,
    paymentMethod?: string,
    status?: string,
    isActive?: boolean
    transactionDate?: string;
    invoiceId?: string;
    cashierId?: string;
    paymentStatus?: string;
    purchasedProducts?: PurchasedProduct[];
}

interface PurchasedProduct {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
}

export const sampleOrder: OrderDto[] = [
    {
      id: "ON01",
      date: "29/08/2024",
      paymentAmount: 500000,
      totalAmount: 600000,
      createBy: "Nguyễn Văn A",
      paymentMethod: "Credit Card",
      movieDescription: "Phim Deadpool_rap C01",
      movieImage: "https://lumiere-a.akamaihd.net/v1/images/deadpool_wolverine_mobile_640x480_ad8020fd.png",
      status: "Thành Công",
      isActive: true,
      transactionDate: "9:00am 29/08/2024",
      invoiceId: "MDG012315654",
      cashierId: "NV005",
      paymentStatus: "Thành Công",
      purchasedProducts: [
        { productId: "P01", productName: "Vé Thường", quantity: 2, price: 200000, discount: 0 },
        { productId: "P02", productName: "1 Bắp + 2 Nước", quantity: 1, price: 220000, discount: 0 }
      ]
    },
    {
      id: "ON02",
      date: "29/08/2024",
      paymentAmount: 300000,
      totalAmount: 350000,
      createBy: "Trần Thị B",
      paymentMethod: "Momo",
      movieDescription: "Phim Deadpool_rap C01",
      movieImage: "https://lumiere-a.akamaihd.net/v1/images/deadpool_wolverine_mobile_640x480_ad8020fd.png",
      status: "Không Thành Công",
      isActive: true,
      transactionDate: "9:10am 29/08/2024",
      invoiceId: "MDG012315655",
      cashierId: "NV006",
      paymentStatus: "Không Thành Công",
      purchasedProducts: [
        { productId: "P03", productName: "Vé VIP", quantity: 1, price: 300000, discount: 0 }
      ]
    },
    {
      id: "ON03",
      date: "28/08/2024",
      paymentAmount: 400000,
      totalAmount: 500000,
      createBy: "[EMP] Nguyễn Tuấn Vũ",
      paymentMethod: "Tiền Mặt",
      movieDescription: "Phim Deadpool_rap C01",
      movieImage: "https://lumiere-a.akamaihd.net/v1/images/deadpool_wolverine_mobile_640x480_ad8020fd.png",
      status: "Thành Công",
      isActive: true,
      transactionDate: "8:40am 29/08/2024",
      invoiceId: "MDG012315656",
      cashierId: "NV007",
      paymentStatus: "Thành Công",
      purchasedProducts: [
        { productId: "P04", productName: "Combo 2 Vé + 2 Nước", quantity: 1, price: 400000, discount: 0 }
      ]
    },
    {
      id: "OFF02",
      date: "27/08/2024",
      paymentAmount: 400000,
      totalAmount: 500000,
      createBy: "[EMP] Nguyễn Tuấn Vũ",
      paymentMethod: "ZaloPay",
      movieDescription: "Phim DepTraiThaySaiSai_rap C01",
      movieImage: "https://simg.zalopay.com.vn/zlp-website/assets/phim_chieu_rap_thang_8_9_11d89918a8.jpg",
      status: "Không Thành Công",
      isActive: true,
      transactionDate: "9:00pm 27/08/2024",
      invoiceId: "MDG012315657",
      cashierId: "NV008",
      paymentStatus: "Không Thành Công",
      purchasedProducts: [
        { productId: "P05", productName: "Combo 3 Vé + 3 Nước", quantity: 1, price: 400000, discount: 0 }
      ]
    }
  ];


export  interface PaymentDto {
    id: string,
    name: string,
    status: string,
    account: string,
    accountName: string
}
// paymentMethods.ts
export const samplePaymentMethods: PaymentDto[] = [
    {
        id: "1",
        name: 'MoMo',
        status: 'Đang hoạt động',
        account: '3432532341',
        accountName: 'Nguyen Van A'
    },
    {
        id: "2",
        name: 'ZaloPay',
        status: 'Đang hoạt động',
        account: '2352345432',
        accountName: 'Nguyen Van A'
    },
    {
        id: "3",
        name: 'VNPay',
        status: 'Đang hoạt động',
        account: '1293482913',
        accountName: 'Nguyen Van A'
    },
    {
        id: "4",
        name: 'Tiền mặt',
        status: 'Đang hoạt động',
        account: '',
        accountName: 'Khong ap dung'
    }
];
  