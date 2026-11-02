// Is the studio's YouTube channel live right now?
// Two quota units per call (uploads playlist + videos), cached at Vercel's edge for a minute,
// so the default 10,000 units/day quota is never close.
import type { APIRoute } from 'astro';
import { getSettings } from '../../lib/content';

export const prerender = false;

const json = (body: unknown, maxAge: number) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json',
      'cache-control': `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 5}`,
    },
  });

export const GET: APIRoute = async () => {
  const key = import.meta.env.YOUTUBE_API_KEY;
  const { youtubeChannelId: channel, liveBadge } = await getSettings();
  if (!key || !channel || !liveBadge) return json({ live: false, configured: false }, 3600);

  try {
    const api = 'https://www.googleapis.com/youtube/v3';
    const uploads = 'UU' + channel.slice(2);
    const list = await fetch(`${api}/playlistItems?part=contentDetails&maxResults=5&playlistId=${uploads}&key=${key}`).then((r) => r.json());
    const ids: string[] = (list.items ?? []).map((i: any) => i.contentDetails.videoId);
    if (!ids.length) return json({ live: false }, 60);
    const videos = await fetch(`${api}/videos?part=snippet&id=${ids.join(',')}&key=${key}`).then((r) => r.json());
    const live = (videos.items ?? []).find((v: any) => v.snippet.liveBroadcastContent === 'live');
    return live
      ? json({ live: true, title: live.snippet.title, url: `https://www.youtube.com/watch?v=${live.id}` }, 60)
      : json({ live: false }, 60);
  } catch {
    return json({ live: false, error: true }, 30);
  }
};
