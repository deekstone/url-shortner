import { nanoid } from 'nanoid';
import * as redis from 'redis';

const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

/**
 * Retrieves the original URL associated with a shortened URL.
 *
 * @param req - The NextApiRequest object representing the incoming request.
 * @returns A Response object with a status code of 301 and a 'Location' header set to the original URL, if successful.
 *          Otherwise, a Response object with a status code of 400 and an error message.
 */
export async function GET(
  req: Request,
  { params }: { params: { shortUrl: string } }
) {
  try {
    const { shortUrl } = params;
    if (!shortUrl) throw new Error('no url provided');

    const originalUrl = await redisClient.get(shortUrl);

    return new Response('success', {
      status: 301,
      headers: { Location: originalUrl || '' },
    });
  } catch (e) {
    return new Response(e?.message, { status: 400 });
  }
}
