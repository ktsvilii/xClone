import { Link } from 'react-router-dom';

import XSvg from 'components/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { MdPassword } from 'react-icons/md';
import { useForm } from 'react-hook-form';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = data => {
    console.log(data);
  };

  const isError = false;

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
      <div className='flex-1 hidden lg:flex items-center justify-center'>
        <XSvg className='lg:w-2/3 fill-white' />
      </div>
      <div className='flex-1 flex flex-col justify-center items-center'>
        <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit(onSubmit)}>
          <XSvg className='w-24 lg:hidden fill-white' />
          <h1 className='text-4xl font-extrabold text-white'>{"Let's"} Crypto.</h1>
          <div>
            <label className='input input-bordered rounded flex flex-1 items-center gap-2'>
              <MdOutlineMail />
              <input
                type='text'
                className='grow'
                placeholder='Username'
                {...register('username', { required: true })}
              />
            </label>
            {errors.username && <small className='text-red-500'>Username is a required field.</small>}
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

          <button className='btn rounded-full btn-primary text-white'>Login</button>
          {isError && <p className='text-red-500'>Something went wrong</p>}
        </form>
        <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
          <p className='text-white text-lg'>{"Don't"} have an account?</p>
          <Link to='/signup'>
            <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
