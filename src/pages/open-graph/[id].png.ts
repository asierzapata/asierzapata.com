import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html } from 'satori-html';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map((post) => ({
    params: { id: post.id },
    props: { post },
  }));
}

interface Props {
  post: CollectionEntry<'posts'>;
}

export const GET = async ({ props }: { props: Props }) => {
  const { post } = props;

  const fontPath = path.resolve('./node_modules/@fontsource/merriweather/files/merriweather-latin-400-normal.woff');
  const fontData = fs.readFileSync(fontPath);

  const markup = html`
    <div
      style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: white; padding: 40px; justify-content: space-between; border: 20px solid #2563eb;"
    >
      <div style="display: flex; flex-direction: column;">
        <div style="font-size: 24px; color: #6b7280; margin-bottom: 20px; font-family: Merriweather;">
          Asier Zapata &bull; Async
        </div>
        <div style="font-size: 60px; font-weight: bold; color: #2563eb; font-family: Merriweather; line-height: 1.2;">
          ${post.data.title}
        </div>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: flex-end; width: 100%;">
        <div style="display: flex; gap: 10px;">
          ${post.data.tags?.slice(0, 3).map((tag: string) => `
            <div style="background-color: #dbeafe; color: #1d4ed8; padding: 5px 15px; border-radius: 4px; font-size: 20px; font-family: Merriweather;">
              #${tag}
            </div>
          `).join('') || ''}
        </div>
        <div style="font-size: 24px; color: #9ca3af; font-family: Merriweather;">
          ${new Date(post.data.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  `;

  // @ts-ignore - satori types can be tricky with the html template literal result
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Merriweather',
        data: fontData,
        style: 'normal',
        weight: 400,
      },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};
