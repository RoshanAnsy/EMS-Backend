import { suggestionRepository } from "../config/redis.schema";


(async () => {
    await suggestionRepository.createIndex(); // Ensure index is created
    console.log("🔍 Index on 'title' created successfully!");
})();