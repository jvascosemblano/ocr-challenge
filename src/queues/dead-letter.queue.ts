import { Queue } from 'bullmq';
import { connection } from '../services';


export const deadLetterQueue = new Queue('dead-letter', {
  connection,
});