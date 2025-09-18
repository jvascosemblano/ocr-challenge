import { OCRResultType } from "../types";

export const simulateOCR = (imageBuffer: Buffer): Promise<OCRResultType> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "This is a simulated OCR result.",
        confidence: 0.98,
        language: "en",
      });
    }, 500);
  });
}