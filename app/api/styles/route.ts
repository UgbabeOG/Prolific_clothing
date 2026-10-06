import { NextRequest, NextResponse } from 'next/server';
import { parseStyleId, STYLE_PAGE_SIZE } from '@/lib/styles';
import { getSupabaseConfig } from '@/lib/supabase/config';
import { getPublicStyles } from '@/lib/styles.server';

export async function GET(request: NextRequest) {
  if (!getSupabaseConfig()) {
    return NextResponse.json({ error: 'The Style Library is not configured yet.' }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const idsParam = searchParams.get('ids');
  const category = searchParams.get('category') ?? undefined;
  const beforeParam = searchParams.get('before');

  if (idsParam !== null) {
    const ids = idsParam.split(',').map((id) => parseStyleId(id));
    if (ids.length > 200 || ids.some((id) => id === null)) {
      return NextResponse.json({ error: 'The saved style list is invalid.' }, { status: 400 });
    }
    try {
      const styleNumbers = ids.filter((id): id is number => id !== null);
      const styles = await getPublicStyles({ ids: styleNumbers, limit: 200 });
      return NextResponse.json({ styles });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Could not load saved styles.';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  let before: number | undefined;
  if (beforeParam) {
    before = parseStyleId(beforeParam) ?? undefined;
    if (before === undefined) {
      return NextResponse.json({ error: 'The pagination cursor is invalid.' }, { status: 400 });
    }
  }

  try {
    const results = await getPublicStyles({ category, before, limit: STYLE_PAGE_SIZE + 1 });
    const hasMore = results.length > STYLE_PAGE_SIZE;
    const styles = results.slice(0, STYLE_PAGE_SIZE);
    const nextCursor = styles.at(-1)?.styleId ?? null;
    return NextResponse.json({ styles, nextCursor, hasMore });
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : 'Could not load styles.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
