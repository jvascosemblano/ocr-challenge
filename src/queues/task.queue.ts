import { Queue, Worker, Job } from "bullmq";
import { saveDocument, updateDocumentStatus } from "../libs/services";
import { DocumentStatusEnum } from "../enums";
import {
  connection,
  extractDocument,
  validateDocument
} from "../services";
import { deadLetterQueue } from "./dead-letter.queue";

export const documentQueue = new Queue("documents", { connection });
export const documentWorker = new Worker(
  "documents",
  async (job: Job) => {
    try {
      if (!job.id) {
        throw new Error("Job ID is not defined");
      }

      console.log(`Procesing document ${job.id}`);
      await updateDocumentStatus(job.id, DocumentStatusEnum.PROCESSING);

      const data = job.data;
      const extracted = await extractDocument(data);
      const validated = await validateDocument(extracted);
      await saveDocument(job.id, validated);

      console.log(`Document ${job.id} was processed!`);
      return { success: true };
    } catch (error: { message?: string } | any) {
      if (job.id) {
        await updateDocumentStatus(job.id, DocumentStatusEnum.FAILED);
        console.error(`Error processing document ${job.id}:`, error?.message);
      } else {
        console.error("Unexpected error:", error?.message);
      }

      throw error;
    }
  },
  { connection, concurrency: 5 }
);

documentWorker.on("failed", async (job: Job | undefined, err: Error | null) => {
  if (!job || !err) return;

  console.error(`Job ${job.id} failed:`, err.message);

  if (job.attemptsMade >= (job.opts.attempts || 0)) {
    await deadLetterQueue.add("failed-job", {
      jobId: job.id,
      data: job.data,
      failedReason: err.message,
    });

    console.log(`Job ${job.id} moved to dead-letter queue`);
  }
});