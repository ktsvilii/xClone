import { useForm } from 'react-hook-form';
import useUpdateUserProfile from 'hooks/useUpdateUserProfile';

import LoadingSpinner from 'components/common/LoadingSpinner';

const EditProfileModal = ({ authUser }) => {
  const { register, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      fullName: authUser.fullName,
      username: authUser.username,
      email: authUser.email,
      bio: authUser.bio,
      link: authUser.link,
      newPassword: '',
      currentPassword: '',
    },
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-sm'
        onClick={() => document.getElementById('edit_profile_modal').showModal()}
      >
        Edit profile
      </button>
      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border rounded-md border-gray-700 shadow-md'>
          <h3 className='font-bold text-lg my-3'>Update Profile</h3>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit(updateProfile)}>
            <div className='flex flex-wrap gap-2'>
              <input
                type='text'
                placeholder='Full Name'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('fullName')}
              />
              <input
                type='text'
                placeholder='Username'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('username')}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='email'
                placeholder='Email'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('email')}
              />
              <textarea
                placeholder='Bio'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('bio')}
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <input
                type='password'
                placeholder='Current Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('currentPassword')}
              />
              <input
                type='password'
                placeholder='New Password'
                className='flex-1 input border border-gray-700 rounded p-2 input-md'
                {...register('newPassword')}
              />
            </div>
            <input
              type='text'
              placeholder='Link'
              className='flex-1 input border border-gray-700 rounded p-2 input-md'
              {...register('link')}
            />
            <button type='submit' className='btn btn-primary rounded-full btn-sm text-white'>
              {isUpdatingProfile ? <LoadingSpinner size='sm' /> : 'Update'}
            </button>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
