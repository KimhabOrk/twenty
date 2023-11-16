import { DateTime } from 'luxon';

import { Comment } from '@/activities/types/Comment';

export const mockComment: Pick<
  Comment,
  'id' | 'author' | 'createdAt' | 'body' | 'updatedAt'
> = {
  id: 'fake_comment_1_uuid',
  body: 'Hello, this is a comment.',
  author: {
    id: 'fake_comment_1_author_uuid',
    firstName: 'Jony' ?? '',
    lastName: 'Ive' ?? '',
    avatarUrl: null,
  },
  createdAt: DateTime.fromFormat('2021-03-12', 'yyyy-MM-dd').toISO() ?? '',
  updatedAt: DateTime.fromFormat('2021-03-13', 'yyyy-MM-dd').toISO() ?? '',
};

export const mockCommentWithLongValues: Pick<
  Comment,
  'id' | 'author' | 'createdAt' | 'body' | 'updatedAt'
> = {
  id: 'fake_comment_2_uuid',
  body: 'Hello, this is a comment. Hello, this is a comment. Hello, this is a comment. Hello, this is a comment. Hello, this is a comment. Hello, this is a comment.',
  author: {
    id: 'fake_comment_1_author_uuid',
    firstName: 'Jony' ?? '',
    lastName: 'Ive' ?? '',
    avatarUrl: null,
  },
  createdAt: DateTime.fromFormat('2021-03-12', 'yyyy-MM-dd').toISO() ?? '',
  updatedAt: DateTime.fromFormat('2021-03-13', 'yyyy-MM-dd').toISO() ?? '',
};
