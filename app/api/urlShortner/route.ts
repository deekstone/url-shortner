import { nanoid } from 'nanoid';
import * as redis from 'redis';

const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

/**
 * Handles the POST request to create a shortened URL.
 *
 * @param req - The NextApiRequest object representing the incoming request.
 * @returns A Promise that resolves to a NextResponse object representing the response.
 * @throws If no original URL is provided, an error is thrown.
 */
export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const originalUrl = searchParams.get('originalUrl');

        if (!originalUrl) throw new Error('no url provided');

        const nanoidId = nanoid();

        redisClient.set(nanoidId, originalUrl);

        return Response.json({
            message: 'success',
            shortenedUrl: 'http://localhost:3000/api/urlShortner/' + nanoidId,
        });
    } catch (e) {
        return new Response(e?.message, { status: 400 });
    }
}
