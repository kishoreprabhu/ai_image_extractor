type Items = {
    itemCost: number;
    itemName: string;
}

type LLMResponse = {
    currency: string;
    date: string;
    gst: number;
    items: Items[];
    total: number;
    vendorName: string;
}

type extractedJson = {
    data: LLMResponse;
    success: boolean;
}

type Extraction = {
    extractedJson:extractedJson;
    id: string;
}

export type Receipt = {
    extraction: Extraction;
    fileName: string;
    fileType: string;
    id: string;
    publicUrl: string;
    status: string;
    uploadedAt: string;
}

export type PaginationResponse = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ReceiptList = {
    items: Receipt[];
    meta: PaginationResponse;
}

export type AddReceiptResponse = {
    message: string;
    receipt: Receipt
}

export type ReceiptStatus = {
    ids: string[]
}