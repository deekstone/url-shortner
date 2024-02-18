import { NextResponse } from "next/server"
import { nanoid } from 'nanoid'
import * as redis from 'redis';
import { NextApiRequest, NextApiResponse } from "next";


const redisClient = redis.createClient();
redisClient.connect().catch(console.error)

 

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