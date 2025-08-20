import { createDatabaseAdapter } from '@v1/database/adapters';
import { logger } from '@v1/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const result = await adapter.updatePost(params.id, { title, content });

    if (result.error) {
      logger.error('Error updating post:', result.error);
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    logger.error('Error in posts PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adapter = createDatabaseAdapter();
    const result = await adapter.deletePost(params.id);

    if (result.error) {
      logger.error('Error deleting post:', result.error);
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in posts DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
