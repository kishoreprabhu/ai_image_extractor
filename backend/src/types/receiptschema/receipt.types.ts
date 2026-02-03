import { z } from "zod";

export const receiptSchema = z.object({
  date: z.string().nullable(),
  currency: z.string().length(3).nullable(),
  vendorName: z.string().nullable(),
  gst: z.number().nullable(),
  total: z.number().nullable(),
  items: z.array(z.object({
    itemName: z.string(),
    itemCost: z.number(),
  })).nullable(),
});

export type ReceiptData = z.infer<typeof receiptSchema>;

// Gemini tool definition
export const receiptExtractionFunction = {
  functionDeclarations: [{
    name: "extract_receipt_data",
    description: "Extract key fields from a receipt image",
    parameters: {
      type: "object",
      properties: {
        date: { type: "string", description: "Date of the receipt" },
        currency: { type: "string", description: "3 letter currency like USD, INR, EUR" },
        vendorName: { type: "string", description: "Vendor or shop name" },
        gst: { type: "number", description: "GST/Tax for the whole receipt" },
        total: { type: "number", description: "Total amount" },
        items: {
          type: "array",
          description: "List of purchased items",
          items: {
            type: "object",
            properties: {
              itemName: { type: "string" },
              itemCost: { type: "number" }
            },
            required: ["itemName", "itemCost"]
          }
        }
      },
      required: ["date", "currency", "gst", "vendorName", "total", "items"]
    }
  }]
};

export enum ExtractStatus {
  "EXTRACTED" = "EXTRACTED",
  "INVALID" = "INVALID", 
  "FAILED" = "FAILED"
}
