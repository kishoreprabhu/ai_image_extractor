import { apiRequest } from "../../shared/utils";
import { API_RECEIPTS, API_DELETE_RECEIPT, 
    API_CHECK_RECEIPTS_STATUS, RequestOptions } from "../../shared/constant";
import { ReceiptStatus } from "../../types/receipt";

export const getUserReceipts = async () => {
    let options:RequestOptions = {
        url: API_RECEIPTS,
        method: "GET"
    }
    const response = await apiRequest(options);   
    if(response?.data) return response.data;
    else return response;
}

export const deleteUserReceipt = async(receiptId:string) => {
   let url = API_DELETE_RECEIPT;
   url = url.replace("{itemId}", receiptId);
   let options:RequestOptions = {
       url,
       method: "DELETE"
   }
   const response = await apiRequest(options);   
    if(response?.data) return response.data;
    else return response;
}

export const uploadReceipt = async(formData: FormData) => {
    let options:RequestOptions = {
        url: API_RECEIPTS,
        method: "POST",
        body: formData
    }
    const response = await apiRequest(options);   
    return response;
}

export const getReceiptsByIds = async(receiptIds: string[]) => {
     let payload:ReceiptStatus = {
        ids: receiptIds
     };
     let options:RequestOptions = {
        url: API_CHECK_RECEIPTS_STATUS,
        method: "POST",
        body: payload
     }
     const response = await apiRequest(options);   
     return response;
}