import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const usePost = post => {
  const queryClient = useQueryClient();

  const formattedDate = '1h';
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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

  const handlePostComment = e => {
    e.preventDefault();
  };

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };
  return { formattedDate, deletePost, isDeletingPost, isLikingPost, handlePostComment, handleLikePost };
};

export default usePost;
