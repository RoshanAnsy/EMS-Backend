import { Schema } from "redis-om";
import { Repository } from "redis-om";
import {redisClient} from "./redis"

export const redisSchema= new Schema('suggestions',{
    title:{type:"text"},
    id:{type:"string"},
    tags:{type:'string[]'}
},
{dataStructure:"HASH"}
)

export const redisCatch = new Schema('catchList', {
    heading: { type: "text" },
    id: { type: "string" },
    date: { type: 'date', sortable: true }, // ✅ make date sortable
    categories: { type: 'text' },
}, { dataStructure: "HASH" });

export const catchRepository = new Repository(redisCatch,redisClient);
export const suggestionRepository= new Repository(redisSchema,redisClient);
// (async ()=>{
//     await suggestionRepository.createIndex();
// })()