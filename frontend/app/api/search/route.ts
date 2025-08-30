import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const limit = searchParams.get('limit') || '50';
  const media = searchParams.get('media') || 'podcast';

  if (!term) {
    return NextResponse.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }

  try {
    // iTunes API call
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&media=${media}&limit=${limit}&country=US&lang=en_us`,
      {
        headers: {
          'User-Agent': 'Thamanea-Search/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match your existing format
    const transformedResults = data.results?.map((item: Record<string, unknown>) => ({
      id: item.trackId || item.collectionId,
      track_id: item.trackId || item.collectionId,
      track_name: item.trackName || item.collectionName,
      artist_name: item.artistName,
      description: item.description || item.longDescription || '',
      primary_genre_name: item.primaryGenreName,
      artwork_url_100: item.artworkUrl100,
      artwork_url_600: item.artworkUrl600,
      track_view_url: item.trackViewUrl,
      release_date: item.releaseDate,
      country: item.country,
      kind: item.kind,
      track_count: item.trackCount,
    })) || [];
    
    return NextResponse.json({
      results: transformedResults,
      resultCount: data.resultCount || 0,
      searchTerm: term,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchTerm, limit = 50 } = body;

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Call the GET handler
    const url = new URL(request.url);
    url.searchParams.set('term', searchTerm);
    url.searchParams.set('limit', limit.toString());
    
    const searchRequest = new NextRequest(url);
    return GET(searchRequest);
  } catch (error) {
    console.error('POST search error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
