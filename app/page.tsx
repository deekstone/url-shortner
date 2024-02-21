'use client';

import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className=" border-2 border-black p-3 mt-5 max-w-[700px] m-auto ">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            setIsLoading(true);
            const originalUrl = e?.target?.originalUrl?.value;

            const shortened = await fetch(
              `http://localhost:3000/api/urlShortner?originalUrl=${originalUrl}`,
              { method: 'POST' }
            );
            const res = await shortened.json();
            setShortenedUrl(res.shortenedUrl);
          } catch (e) {
            //handle error
          } finally {
            setIsLoading(false);
          }
        }}
      >
        <div className=" flex flex-col ">
          <input
            type="text"
            name="originalUrl"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            placeholder="Enter url here."
            className=" border-2 p-2"
          />

          <div className=" flex flex-row pt-3">
            <b>Shortened Url:</b>
            <span>{`  ${shortenedUrl}`}</span>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className=" border-2 mt-10 bg-black text-white p-2"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
