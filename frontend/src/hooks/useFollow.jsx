import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useFollow = () => {
  const queryClient = useQueryClient();

  const { mutate: followController, isPending } = useMutation({
    mutationFn: async userId => {
      const res = await fetch(`/api/users/follow/${userId}`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    },
    onSuccess: data => {
      toast.success(data.message);
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
        queryClient.invalidateQueries({ queryKey: ['authUser'] }),
      ]);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  return { followController, isPending };
};

export default useFollow;
