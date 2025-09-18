import { Router } from "express";
import { documentQueue } from "../queues";
import { DocumentStatusEnum } from "../enums";
import { connection } from "../services";

export const documentsRouter = Router();

documentsRouter.post("/", async (req, res) => {
  const documentData = req.body;

  if (!documentData || Object.keys(documentData).length === 0) {
    return res.status(400).json({ message: "Document data is missing!" });
  }

  const processDocJob = await documentQueue.add("processDocument", documentData, {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });

  await connection.set(
    `document:${processDocJob?.id}`,
    JSON.stringify({ ...documentData, status: DocumentStatusEnum.UPLOADED })
  );

  res.status(202).json({ message: "Document was uploaded successfully!", jobId: processDocJob.id });
});

documentsRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const documentMetadata = await connection.get(`document:${id}`);
  if (!documentMetadata) {
    return res.status(404).json({ message: "Document not found" });
  }

  res.json(JSON.parse(documentMetadata));
});
