import { nanoid } from 'nanoid'
import * as redis from 'redis';

const redisClient = redis.createClient();
redisClient.connect().catch(console.error)

/**
 * Retrieves the original URL associated with a shortened URL.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @returns A Response object with a status code of 301 and a 'Location' header set to the original URL, if successful. 
 *          Otherwise, a Response object with a status code of 400 and an error message.
 */
export async function GET(req: Request){
    try{
        const { searchParams } = new URL(req.url)
        const shortenedUrl = searchParams.get('shortenedUrl') 
    
        if(!shortenedUrl) throw new Error('no url provided')

        const originalUrl =  await redisClient.get(shortenedUrl)

        return new Response("success", { status:301, headers: {'Location': originalUrl || ''}})
    }catch(e){
        return  new Response(e?.message,{status:400})
    } 
}












/**
 * Handles the POST request to create a shortened URL.
 * 
 * @param req - The NextApiRequest object representing the incoming request.
 * @returns A Promise that resolves to a NextResponse object representing the response.
 * @throws If no original URL is provided, an error is thrown.
 */ 
export async function POST(req: Request){
    try{
        const { searchParams } = new URL(req.url)
        const originalUrl = searchParams.get('originalUrl') 
    
        if(!originalUrl) throw new Error('no url provided')
    
        const nanoidId = nanoid()
    
        redisClient.set(nanoidId, originalUrl)
    
        return  Response.json({message: 'success', shortenedUrl: 'http://localhost:3000/api/urlShortner?shortenedUrl='+nanoidId})
    }catch(e){
        return  new Response(e?.message,{status:400})
    } 
} 