import { Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import XSvg from 'components/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdPassword } from 'react-icons/md';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { EMAIL_VALIDATION_REGEX } from 'shared/regex';
import toast from 'react-hot-toast';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const queryClient = useQueryClient();

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      console.log(data);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const onSubmit = data => {
    mutate(data);
  };

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit(onSubmit)}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
          <div>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdOutlineMail />
              <input
                type='email'
                className='grow'
                placeholder='Email'
                {...register('email', { required: true, pattern: EMAIL_VALIDATION_REGEX })}
              />
            </label>
            {errors.email && <small className='text-red-500'>Please enter valid email address.</small>}
          </div>

          <div className='flex gap-4 flex-wrap'>
            <div className='flex-1'>
              <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                <FaUser />
                <input
                  type='text'
                  className='grow'
                  placeholder='Username'
                  {...register('username', { required: true })}
                />
              </label>
              {errors.username && <small className='text-red-500'>Username is a required field.</small>}
            </div>

            <div className='flex-1'>
              <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                <MdDriveFileRenameOutline />
                <input
                  type='text'
                  className='grow'
                  placeholder='Full Name'
                  {...register('fullName', { required: true })}
                />
              </label>
              {errors.fullName && <small className='text-red-500'>Full Name is a required field.</small>}
            </div>
          </div>
          <div>
            <label className='input input-bordered rounded flex items-center gap-2'>
              <MdPassword />
              <input
                type='password'
                className='grow'
                placeholder='Password'
                {...register('password', { required: true })}
              />
            </label>
            {errors.password && <small className='text-red-500'>Password is a required field.</small>}
          </div>

          <button className='btn rounded-full btn-primary text-white'>{isPending ? 'Loading...' : 'Sign up'}</button>
          {isError && <p className='text-red-500'>{error.message}</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <Link to='/login'>
            <p className='text-white text-lg'>Already have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
