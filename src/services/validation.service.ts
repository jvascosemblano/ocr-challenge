import { DocumentStatusEnum } from "../enums";
import { DocumentMetadataType } from "../types";

export const validateDocument = async (documentMetadata: DocumentMetadataType) => {
  const errors: string[] = [];

  if (!documentMetadata.type) { errors.push("Missing type"); }
  if (!documentMetadata?.content) { errors.push("Missing content"); }
  if (!documentMetadata.date) { errors.push("Missing date"); }
  if (documentMetadata.total == null || isNaN(documentMetadata.total)) {
    errors.push("Invalid total value");
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }


  return { ...documentMetadata, status: DocumentStatusEnum.VALIDATED };
};