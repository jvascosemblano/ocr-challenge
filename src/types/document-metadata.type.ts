import { DocumentStatusEnum } from "../enums";

export type DocumentMetadataType = {
  type: string;
  content: string;
  date: string;
  total: number;
	customer?: string;
	status?: DocumentStatusEnum
};