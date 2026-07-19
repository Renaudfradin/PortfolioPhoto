import { createHash, timingSafeEqual } from 'crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import {
  CACHE_TAGS,
  articleCacheTags,
  articlePaths,
} from '@/lib/cache-tags';

type RevalidateType =
  | 'article'
  | 'articles'
  | 'photography'
  | 'photographies';

type RevalidateBody = {
  secret?: string;
  type?: RevalidateType;
  slug?: string;
};

const ALLOWED_TYPES = new Set<RevalidateType>([
  'article',
  'articles',
  'photography',
  'photographies',
]);

function secretsEqual(provided: string, expected: string): boolean {
  const a = createHash('sha256').update(provided).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function isAuthorized(request: NextRequest, bodySecret?: string): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return false;

  const headerSecret = request.headers.get('x-revalidate-secret');
  const provided = bodySecret ?? headerSecret;
  if (!provided) return false;

  return secretsEqual(provided, expected);
}

function expireTag(tag: string) {
  revalidateTag(tag, { expire: 0 });
}

export async function POST(request: NextRequest) {
  let body: RevalidateBody = {};

  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    body = {};
  }

  if (!isAuthorized(request, body.secret)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const type = body.type;

  if (!type || !ALLOWED_TYPES.has(type)) {
    return NextResponse.json(
      {
        message:
          'Provide type: article | articles | photography | photographies',
      },
      { status: 400 },
    );
  }

  const revalidated: { tags: string[]; paths: string[] } = {
    tags: [],
    paths: [],
  };

  switch (type) {
    case 'article': {
      if (!body.slug) {
        return NextResponse.json(
          { message: 'slug is required for type=article' },
          { status: 400 },
        );
      }
      const tags = articleCacheTags(body.slug);
      tags.forEach(expireTag);
      revalidated.tags.push(...tags);

      const paths = articlePaths(body.slug);
      paths.forEach((path) => revalidatePath(path));
      revalidated.paths.push(...paths);
      break;
    }
    case 'articles': {
      expireTag(CACHE_TAGS.articles);
      revalidated.tags.push(CACHE_TAGS.articles);
      break;
    }
    case 'photography': {
      if (!body.slug) {
        return NextResponse.json(
          { message: 'slug is required for type=photography' },
          { status: 400 },
        );
      }
      const tags = [
        CACHE_TAGS.photographies,
        CACHE_TAGS.photography(body.slug),
      ];
      tags.forEach(expireTag);
      revalidated.tags.push(...tags);
      break;
    }
    case 'photographies': {
      expireTag(CACHE_TAGS.photographies);
      revalidated.tags.push(CACHE_TAGS.photographies);
      break;
    }
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
    ...revalidated,
  });
}
