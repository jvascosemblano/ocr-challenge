# Processing Pipeline Challenge

## **Getting Started Locally**

### **Prerequisites**
- Node.js >= 18  
- npm >= 9  
- Docker & Docker Compose installed

### **Clone and Install**
```bash
git clone https://github.com/jvascosemblano/ocr-challenge.git
cd ocr-challenge
npm install
```

### **Build and Run Containers**

```bash
docker-compose up --build -d
```

- The backend server will run on **port 4000**.
- Redis will run on **port 6379**.

---

### **Testing the Pipeline**

**Upload a document:**
```bash
curl -X POST http://localhost:4000/documents \
-H "Content-Type: application/json" \
-d '{
  "type": "invoice",
  "data": "fake image buffer placeholder",
  "customer": "John Doe",
  "total": 1250.75
}'
```

**Check document status and metadata:**
```bash
curl http://localhost:4000/documents/<jobId>
```

**Example Response After Processing:**
```json
{
  "type": "invoice",
  "content": "This is a simulated OCR result.",
  "date": "2025-09-18T12:34:56.789Z",
  "total": 1250.75,
  "customer": "John Doe",
  "status": "validated"
}
```

## **Challenge Decision Making & Documentation**

### **Architecture & Design**

The goal is to build a **prototype of a multi-stage document processing pipeline**, consisting of the following stages:

**1. Document Upload (Ingestion)**
- A simple API endpoint is used to ingest documents.
- This approach allows for a robust prototype that simulates a real-world application with simplicity.

**2. Processing**
- Documents are processed asynchronously via a task queue (BullMQ + Redis).
- Processing includes:
  - **Extraction** – simulated OCR and metadata extraction.
  - **Validation** – ensures required fields are present.
  - **Persistence** – stores metadata in Redis.
- Each step is handled by **modular services**, improving maintainability.

**3. Validation**
- Documents are verified for required fields and correct formats.
- Validation is **isolated from extraction** to maintain separation of concerns.

**4. Persistence**
- Processed documents are stored in **Redis** as JSON.
- Redis was chosen to simplify infrastructure while demonstrating persistence functionality.
- Each document is stored under a **unique key** for easy retrieval.

---

### **Async Processing**
- Documents are **queued after ingestion**.
- Workers process documents in the background.
- BullMQ handles:
  - **Retries** – failed jobs retry automatically with exponential backoff.
  - **Dead-letter handling** – permanently failed jobs are logged for review.

---

### **Separation of Concerns**
- **Routes / Controllers** – handle API requests only.  
- **Services** – handle business logic for extraction, validation, and persistence.  
- **Worker / Queue** – orchestrates asynchronous execution of pipeline stages.  

This separation improves **readability, maintainability, and testability**.

---

### **Error Handling**
- Structured logging for failed jobs.
- Automatic retries up to a defined number of attempts.
- Permanent failures are handled gracefully and the document status is updated to `"failed"`.

---

### **Technology Choices**

| Component | Purpose | Reason |
|-----------|--------|--------|
| Express.js | API framework | Lightweight, easy setup |
| Redis | Database | Simple storage solution |
| BullMQ | Queueing | Easy-to-scale job processing in Node.js |
| ioredis | Redis Client | Well-documented, standard for Node.js |

---

### **Application Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/documents` | POST | Upload a new document; adds job to queue; sets status `"uploaded"` |
| `/documents/:id` | GET | Retrieve processed document and current status |
---
