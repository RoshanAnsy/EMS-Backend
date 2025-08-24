import { parentPort } from 'worker_threads';
import { suggestionRepository } from '../config/redis.schema';
import { redisClient } from '../config/redis';



const RETRY_QUEUE = "failed_article_suggestions"; // Redis list for retrying failed jobs

if (parentPort) {
    parentPort.on('message', async (article) => {
        try {
            await suggestionRepository.save(article);
            // parentPort.postMessage("Article suggestion saved successfully");
        } catch (err) {
            console.error("Error saving article suggestion, adding to retry queue:", err);

            try {
                // Push failed article to Redis queue
                await redisClient.lPush(RETRY_QUEUE, JSON.stringify(article));
                // parentPort.postMessage("Article added to retry queue");
            } catch (redisError) {
                console.error("Failed to push to Redis retry queue:", redisError);
                // parentPort.postMessage("Critical error: Failed to save and retry article");
            }
        }
    });
}
