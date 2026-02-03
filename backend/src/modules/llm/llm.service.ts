import { Injectable } from "@nestjs/common";
import { GoogleGenerativeAI, Tool } from "@google/generative-ai";
import { receiptSchema, ReceiptData, receiptExtractionFunction } from "../../types/receiptschema/receipt.types";

@Injectable()
export class LLMService {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ functionDeclarations: receiptExtractionFunction.functionDeclarations }] as Tool[],
    });
  }

  async extractReceiptData(imageBlob: Blob, mimeType: string): Promise<ReceiptData> {
    // coverting blob to base64
    const arrayBuffer = await new Response(imageBlob).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer); 
    const base64Data = buffer.toString("base64");

    const prompt = `You are an expert OCR & receipt parser. Analyze the image and call extract_receipt_data().`;

    const result = await this.model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data, 
          mimeType: mimeType,
        },
      },
    ]);

    const response = result.response;
    const functionCall = response.candidates?.[0]?.content?.parts?.find(p => p.functionCall)?.functionCall;

    if (!functionCall) {
      throw new Error("Gemini failed to trigger the extraction function.");
    }

    // calling the tool
    const args = functionCall.args; 
    
    const parsed = receiptSchema.safeParse(args);
    if (!parsed.success) {
      throw new Error(`Validation failed: ${parsed.error.message}`);
    }

    return parsed.data;
  }
}
