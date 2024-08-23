import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';

import { formatPostDate } from 'utils/date';

const usePost = post => {
  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/delete/${post._id}`, {
          method: 'DELETE',
        });
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
    onSuccess: () => {
      toast.success('Post deleted successfully');
      queryClient.setQueryData(['posts'], oldData => {
        return oldData.filter(p => p._id !== post._id);
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: 'POST',
        });
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
    onSuccess: likes => {
      queryClient.setQueryData(['posts'], oldData => {
        return oldData.map(p => (p._id === post._id ? { ...p, likes } : p));
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommentingPost } = useMutation({
    mutationFn: async commentText => {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: commentText,
        }),
      });
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      return data;
    },
    onSuccess: comments => {
      queryClient.setQueryData(['posts'], oldData => {
        return oldData.map(p => (p._id === post._id ? { ...p, comments } : p));
      });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const formattedDate = formatPostDate(post.createdAt);

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };
  return {
    formattedDate,
    deletePost,
    isDeletingPost,
    isLikingPost,
    handleLikePost,
    commentPost,
    isCommentingPost,
  };
};

export default usePost;
