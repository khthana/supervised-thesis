'use client';

import { useState } from 'react';
import Image from 'next/image';
import CryptoJS from 'crypto-js';
import signIn from '/public/favicon/signIn.png';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/config/api';
import { Input, Button, Checkbox, Link, Alert } from '@heroui/react';

export default function Auth() {
  const [activeForm, setActiveForm] = useState('signIn');
  const switchForm = (formName) => {
    setActiveForm(formName);
  };

  return (
    <div className='flex min-h-[calc(100vh-60px)] flex-col bg-gray-100 dark:bg-gray-900'>
      <div className='flex flex-grow items-center justify-center p-4'>
        <div className='flex w-full max-w-6xl flex-col items-center overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800 md:flex-row'>
          <div className='w-full p-8 md:w-1/2'>
            <Image
              src={signIn}
              alt='Learning illustration'
              width={500}
              height={500}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className='w-full p-8 md:w-1/2'>
            <div className='mx-auto max-w-md'>
              <h1 className='mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white'>
                {activeForm === 'signIn' && 'Sign in to your account'}
                {activeForm === 'signUp' && 'Create an account'}
                {activeForm === 'forgotPassword' && 'Reset your password'}
              </h1>
              {activeForm === 'signIn' && (
                <SignInForm switchForm={switchForm} />
              )}
              {activeForm === 'signUp' && (
                <SignUpForm switchForm={switchForm} />
              )}
              {activeForm === 'forgotPassword' && (
                <ForgotPasswordForm switchForm={switchForm} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SignInForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!email.trim()) {
      setAlertType('error');
      setAlertMessage('Email is required');
      setShowAlert(true);
      return;
    }

    if (!password.trim()) {
      setAlertType('error');
      setAlertMessage('Password is required');
      setShowAlert(true);
      return;
    }

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, hashedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlertType('error');
        if (response.status === 401) {
          setAlertMessage('Invalid email or password');
        } else if (response.status === 404) {
          setAlertMessage('Account not found');
        } else if (errorData.message) {
          setAlertMessage(errorData.message);
        } else {
          setAlertMessage('An error occurred during sign in');
        }
        setShowAlert(true);
        return;
      }

      const data = await response.json();
      // setAlertType('success');
      // setAlertMessage('Login successful! Redirecting...');
      // setShowAlert(true);

      // Store user data and redirect after showing success message
      setTimeout(() => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('firstname', data.Firstname);
        localStorage.setItem('lastname', data.Lastname);

        window.dispatchEvent(new Event('authChange'));

        if (data.role === '0' || data.role === 0) {
          router.push('/admin/dashboard');
        } else {
          router.push('/learn');
        }
      }, 2000);
    } catch (error) {
      setAlertType('error');
      setAlertMessage(error.message || 'Network error. Please try again.');
      setShowAlert(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {showAlert && (
        <Alert
          className='mb-4 py-2'
          color={alertType === 'success' ? 'success' : 'danger'}
          onClose={() => setShowAlert(false)}
          variant='bordered'
          isOpen={showAlert}
        >
          <div className='flex items-start gap-2'>
            {alertType === 'error' ? (
              <>
                <span className='font-medium text-danger'>Error: </span>
                <span className='text-danger'>{alertMessage}</span>
              </>
            ) : (
              <>
                <span className='font-medium text-success'>Success: </span>
                <span className='text-success'>{alertMessage}</span>
              </>
            )}
          </div>
        </Alert>
      )}

      <div className='space-y-4'>
        <Input
          type='email'
          label='Email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          size='lg'
          variant='bordered'
        />

        <Input
          type='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          classNames={{
            base: 'w-full',
            input: 'w-full',
          }}
          size='lg'
          variant='bordered'
        />

        <div className='flex items-center justify-between'>
          <Checkbox
            size='sm'
            classNames={{
              label: 'text-sm',
            }}
          >
            Remember me
          </Checkbox>

          <Link
            onPress={() => switchForm('forgotPassword')}
            color='primary'
            size='sm'
            className='text-sm'
          >
            Forgot password?
          </Link>
        </div>

        {error && <p className='text-sm text-danger'>{error}</p>}

        <Button type='submit' color='primary' size='lg' className='w-full'>
          Sign in
        </Button>
      </div>

      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Not Registered Yet?{' '}
          <Link onPress={() => switchForm('signUp')} color='primary' size='sm'>
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
};

const SignUpForm = ({ switchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('confirm password');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      hasMinLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    ) {
      setPasswordStrength('strong');
      return true;
    } else if (hasMinLength && (hasUpperCase || hasLowerCase) && hasNumbers) {
      setPasswordStrength('medium');
      return false;
    } else {
      setPasswordStrength('weak');
      return false;
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validateForm = () => {
    if (!firstname.trim()) {
      setAlertType('error');
      setAlertMessage('First name is required');
      setShowAlert(true);
      return false;
    }
    if (!lastname.trim()) {
      setAlertType('error');
      setAlertMessage('Last name is required');
      setShowAlert(true);
      return false;
    }
    if (!username.trim()) {
      setAlertType('error');
      setAlertMessage('Username is required');
      setShowAlert(true);
      return false;
    }
    if (!email.trim()) {
      setAlertType('error');
      setAlertMessage('Email is required');
      setShowAlert(true);
      return false;
    }
    if (!password) {
      setAlertType('error');
      setAlertMessage('Password is required');
      setShowAlert(true);
      return false;
    }
    if (!validatePassword(password)) {
      setAlertType('error');
      setAlertMessage('Password does not meet strength requirements');
      setShowAlert(true);
      return false;
    }
    if (password !== confirmPassword) {
      setAlertType('error');
      setAlertMessage('Passwords do not match');
      setShowAlert(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    if (password === confirmPassword) {
      try {
        const hashedPassword = CryptoJS.SHA256(password).toString();
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstname,
            lastname,
            username,
            email,
            password: hashedPassword,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setAlertType('error');
          setAlertMessage(
            errorData.message ||
              errorData.error ||
              'An error occurred during registration. Please try again.'
          );
          setShowAlert(true);
          return;
        }

        const data = await response.json();
        // console.log(data);
        setAlertType('success');
        setAlertMessage('Registration successful! Redirecting to login...');
        setShowAlert(true);

        // Delay redirect to show success message
        setTimeout(() => {
          switchForm('signIn');
        }, 2000);
      } catch (error) {
        setAlertType('error');
        setAlertMessage('An error occurred. Please try again.');
        setShowAlert(true);
      }
    } else {
      setMessage('Passwords do not match.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {showAlert && (
        <Alert
          className='mb-4 py-2'
          color={alertType === 'success' ? 'success' : 'danger'}
          onClose={() => setShowAlert(false)}
          variant='bordered'
          isOpen={showAlert}
        >
          <div className='flex items-start gap-2'>
            {alertType === 'error' ? (
              <span className='text-danger'>Error:</span>
            ) : (
              <span className='text-success'>Success:</span>
            )}
            <span>{alertMessage}</span>
          </div>
        </Alert>
      )}

      <div className='grid gap-y-4'>
        {/* First name and Last name inputs */}
        <div className='flex w-full gap-4'>
          <Input
            type='text'
            label='Firstname'
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
            variant='bordered'
            size='md'
            className='w-1/2'
          />
          <Input
            type='text'
            label='Lastname'
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
            variant='bordered'
            size='md'
            className='w-1/2'
          />
        </div>

        <Input
          type='text'
          label='Username'
          value={username}
          maxLength={16}
          onChange={(e) => setUsername(e.target.value)}
          required
          variant='bordered'
          size='md'
        />

        <Input
          type='email'
          label='Email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant='bordered'
          size='md'
        />
        <div>
          <Input
            type='password'
            label='Password'
            value={password}
            onChange={handlePasswordChange}
            required
            variant='bordered'
            size='md'
            maxLength={16}
            description='Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
            color={
              passwordStrength === 'strong'
                ? 'success'
                : passwordStrength === 'medium'
                  ? 'warning'
                  : passwordStrength
                    ? 'danger'
                    : 'default'
            }
          />

          {passwordStrength && (
            <div className='text-sm'>
              Password strength:{' '}
              <span
                className={
                  passwordStrength === 'strong'
                    ? 'text-success'
                    : passwordStrength === 'medium'
                      ? 'text-warning'
                      : 'text-danger'
                }
              >
                {passwordStrength}
              </span>
            </div>
          )}
        </div>

        <Input
          type='password'
          label={message}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          variant='bordered'
          size='md'
          maxLength={16}
          color={message !== 'confirm password' ? 'danger' : 'default'}
        />

        {error && <p className='text-sm text-danger'>{error}</p>}

        <Button type='submit' color='primary' size='lg' fullWidth>
          Create account
        </Button>

        <div className='mt-4 text-center'>
          <span className='text-gray-600 dark:text-neutral-400'>
            Already have an account?{' '}
          </span>
          <Link
            onPress={() => switchForm('signIn')}
            color='primary'
            className='cursor-pointer'
          >
            Sign in
          </Link>
        </div>
      </div>
    </form>
  );
};

const ForgotPasswordForm = ({ switchForm }) => {
  return (
    <form className='space-y-6' action='#' method='POST'>
      <div>
        <div className='mt-1'>
          <Input
            type='email'
            label='Username'
            // value={}
            required
            variant='bordered'
            size='md'
          />
        </div>
      </div>

      <div>
        <button
          type='submit'
          className='inline-flex w-full items-center justify-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none disabled:pointer-events-none disabled:opacity-50'
        >
          Reset password
        </button>
      </div>
      <div className='mt-10 text-center text-sm'>
        <span className='m-4 text-gray-600 dark:text-neutral-400'>
          Not Registered Yet ?
        </span>

        <a
          className='font-medium text-blue-600 decoration-2 hover:underline focus:underline focus:outline-none dark:text-blue-500'
          onClick={() => switchForm('signUp')}
        >
          Create an account
        </a>
      </div>
    </form>
  );
};
