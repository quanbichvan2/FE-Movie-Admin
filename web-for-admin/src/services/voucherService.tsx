import { AxiosResponse } from "axios";
import { VoucherDto } from "../models/voucherDto";
import baseUrl from "../apis/base";

export const BASE_URL = "Vouchers";

// Function to get all vouchers
export const getAllVouchers = async () => {
    const res = await baseUrl
        .get<VoucherDto[]>(BASE_URL)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
};

// Function to get a voucher by ID
export const getVoucherById = async (id: number | undefined) => {
    const res = await baseUrl
        .get<VoucherDto>(`${BASE_URL}/${id}`)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
};

// Function to create a new voucher
export const createVoucher = async (voucher: VoucherDto) => {
    const res = await baseUrl
        .post<VoucherDto>(BASE_URL, voucher)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
};

// Function to update a voucher
export const updateVoucher = async (voucher: VoucherDto) => {
    const res = await baseUrl
        .put<VoucherDto>(`${BASE_URL}/${voucher.id}`, voucher)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
};

// Function to delete a voucher
export const deleteVoucher = async (id: number | undefined) => {
    const res = await baseUrl
        .delete(`${BASE_URL}/${id}`)
        .then((response: AxiosResponse) => {
            return response.data;
        })
        .catch((error) => {
            console.log(error);
        });
    return res;
};

