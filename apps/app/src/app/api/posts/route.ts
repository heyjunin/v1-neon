import { createDatabaseAdapter } from '@v1/database/adapters';
import { logger } from '@v1/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const adapter = createDatabaseAdapter();
    const result = await adapter.getPostsWithUsers(
      { search },
      { page, limit }
    );

    if (result.error) {
      logger.error('Error getting posts:', result.error);
      return NextResponse.json(
        { error: 'Failed to get posts' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    logger.error('Error in posts GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const adapter = createDatabaseAdapter();
    const result = await adapter.createPost({ title, content });

    if (result.error) {
      logger.error('Error creating post:', result.error);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    logger.error('Error in posts POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
