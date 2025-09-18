import { connection } from "../../services";
import { DocumentMetadataType } from "../../types";

export const saveDocument = async (id: string, documentMetadata: DocumentMetadataType): Promise<void> => {
  await connection.set(`document:${id}`, JSON.stringify(documentMetadata));
};

export const updateDocumentStatus = async (id: string, status: DocumentMetadataType["status"]): Promise<void> => {
  const documentMetadata = await connection.get(`document:${id}`);
  if (!documentMetadata) {
    throw new Error("Document was not found on the database!");
  }

  const parsedMetadata: DocumentMetadataType = JSON.parse(documentMetadata);
  parsedMetadata.status = status;
  await connection.set(`document:${id}`, JSON.stringify(parsedMetadata));
};

export const getDocument = async (id: string): Promise<DocumentMetadataType | null> => {
  const documentMetadata = await connection.get(`document:${id}`);
  return documentMetadata ? JSON.parse(documentMetadata) : null;
};