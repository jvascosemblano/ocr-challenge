import { DocumentStatusEnum } from "../enums";
import { DocumentMetadataType, DocumentType } from "../types";
import { simulateOCR } from "../utils";

export const extractDocument = async (document: DocumentType): Promise<DocumentMetadataType> => {
  if (!document.type || !document.data) {
    throw new Error("Document type and data are not defined!");
  }

  const ocrResult = await simulateOCR(document.data);

  const extracted: DocumentMetadataType = {
    type: document.type,
    content: ocrResult.text,
    date: new Date().toISOString(),
    total: document.total || 0,
    customer: document.customer || "Unknown Customer",
    status: DocumentStatusEnum.PROCESSING
  };

  return extracted;
};