// success toast messages
export const LOGIN_SUCCESS_MSG: string =  "Login successful!";


// error toast messages
export const IMAGE_UPLOAD_ERROR_MSG: string = "Only files in .jpg, .jpeg, and .png format are allowed!";

// contants 
export const ALLOWED_FILE_TYPES: string[] = ["image/jpeg", "image/jpg", "image/png"];
export const STATUS_EXTRACTED: string = "EXTRACTED";
export const STATUS_EXTRACTING: string = "EXTRACTING";
export const STATUS_FAILED: string = "FAILED";
export const STATUS_INVALID: string = "INVALID";
export const POLLING_INTERVAl:number = 5000;


// api paths
export const API_BASE_URL: string = "http://localhost:3000"
export const API_RECEIPTS: string = "/receipts";
export const API_DELETE_RECEIPT: string = "/receipts/{itemId}";
export const API_CHECK_RECEIPTS_STATUS: string= "/receipts/checkStatus";


// HTTP Method type
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type RequestOptions = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: any;
};
