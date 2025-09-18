export type DocumentType = {
  type: "invoice";          
  data: Buffer;
  customer?: string;
  total?: number;
};