import { useQuery } from '@tanstack/react-query';

import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';

import { FeedType } from 'shared/types';
import { useEffect } from 'react';

const Posts = ({ feedType, username, userId }) => {
  const getPostsEndpoint = () => {
    switch (feedType) {
      case FeedType.FOR_YOU:
        return '/api/posts/all';
      case FeedType.FOLLOWING:
        return '/api/posts/following';
      case FeedType.LIKED:
        return `/api/posts/likes/${userId}`;
      case FeedType.POSTS:
        return `/api/posts/user/${username}`;
      default:
        return '/api/posts/all';
    }
  };

  const POSTS_ENDPOINT = getPostsEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(POSTS_ENDPOINT);
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch, feedType, username]);

  if (isLoading || isRefetching) {
    return (
      <div className='flex flex-col justify-center'>
        <PostSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  return (
    <>
      {!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab.</p>}
      {!isLoading && !isRefetching && posts && (
        <>
          {posts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </>
      )}
    </>
  );
};
export default Posts;
