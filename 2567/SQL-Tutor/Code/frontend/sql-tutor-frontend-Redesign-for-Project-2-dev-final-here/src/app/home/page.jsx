'use client';
import NavBar from '@/components/Main_navbar';
import { useRouter } from 'next/navigation';
import {
  Button,
  ScrollShadow,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from '@heroui/react';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <ScrollShadow
        hideScrollBar
        orientation='horizontal'
        className='max-h-[calc(100vh-56px)]'
      >
        <section className='bg-gradient-to-r from-indigo-700 to-purple-700 py-20 text-white'>
          <div className='mx-auto flex max-w-6xl flex-col items-center px-6 md:flex-row'>
            <div className='mb-10 md:mb-0 md:w-1/2'>
              <h1 className='text-4xl font-bold leading-tight md:text-5xl'>
                Master SQL and Unlock Your Data Potential
              </h1>
              <p className='mt-6 text-lg opacity-90 md:text-xl'>
                Learn SQL from the basics to advanced techniques through
                interactive lessons and real-world examples.
              </p>
              <div className='mt-10 flex flex-col gap-4 sm:flex-row'>
                <Button
                  className='rounded-md bg-white px-6 py-3 font-medium text-indigo-700 transition hover:bg-gray-100'
                  onPress={() => router.push('/learn')}
                >
                  Start Learning
                </Button>
              </div>
            </div>
            <div className='md:w-1/2 md:pl-10'>
              <div className='rounded-lg bg-gray-900 p-6 shadow-lg'>
                <pre className='overflow-x-auto text-gray-100'>
                  <ScrollShadow
                    hideScrollBar
                    orientation='horizontal'
                    className='max-w-full'
                  >
                    {`SELECT student_name, course_progress, certificate_status
FROM students
WHERE learning_path = 'SQL Mastery'
ORDER BY course_progress DESC
LIMIT 10;`}
                  </ScrollShadow>
                </pre>
              </div>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section className='py-20'>
          <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold'>Why Learn SQL With Us?</h2>
            <p className='mx-auto mt-4 max-w-2xl'>
              Our platform combines practical lessons with hands-on exercises to
              help you master SQL effortlessly.
            </p>
          </div>
          <div className='mx-auto max-w-6xl px-6'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {/* Feature 1 */}
              <Card className='rounded-lg bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md'>
                <CardHeader className='mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-indigo-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </CardHeader>
                <h3 className='mb-3 text-xl font-semibold'>
                  Interactive Learning
                </h3>
                <p className='text-gray-600'>
                  Practice SQL queries in our interactive environment with
                  immediate feedback and guidance.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card className='rounded-lg bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md'>
                <CardHeader className='mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-indigo-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                </CardHeader>
                <h3 className='mb-3 text-xl font-semibold'>
                  Real-world Projects
                </h3>
                <p className='text-gray-600'>
                  Apply your skills to industry-relevant projects using real
                  database scenarios and challenges.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card className='rounded-lg bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-md'>
                <CardHeader className='mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6 text-indigo-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                    />
                  </svg>
                </CardHeader>
                <h3 className='mb-3 text-xl font-semibold'>
                  Certification Path
                </h3>
                <p className='text-gray-600'>
                  Earn industry-recognized certificates as you progress through
                  beginner to advanced SQL concepts.
                </p>
              </Card>
            </div>
          </div>
        </section>
        {/* Course Tracks */}
        <section className='bg-gray-100 py-20'>
          <div className='mb-12 text-center'>
            <h2 className='text-3xl font-bold'>Learning Paths</h2>
            <p className='mx-auto mt-4 max-w-2xl'>
              Choose the path that matches your goals and current skill level.
            </p>
          </div>
          <div className='mx-auto max-w-6xl px-6'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
              {/* Track 1 */}
              <div className='overflow-hidden rounded-lg bg-white shadow-md'>
                <div className='h-2 bg-blue-500'></div>
                <div className='p-6'>
                  <h3 className='mb-2 text-xl font-semibold'>
                    SQL Fundamentals
                  </h3>
                  <div className='mb-4 flex items-center'>
                    <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800'>
                      Beginner
                    </span>
                    <span className='ml-3 text-sm text-gray-500'>4 Weeks</span>
                  </div>
                  <p className='mb-6 text-gray-600'>
                    Learn essential SQL syntax, queries, and database concepts
                    for beginners with no prior experience.
                  </p>
                  <ul className='mb-6 space-y-2'>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Basic SELECT statements
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Filtering with WHERE
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Sorting & Grouping
                    </li>
                  </ul>
                </div>
              </div>

              {/* Track 2 */}
              <div className='overflow-hidden rounded-lg bg-white shadow-md'>
                <div className='h-2 bg-indigo-600'></div>
                <div className='p-6'>
                  <h3 className='mb-2 text-xl font-semibold'>
                    SQL For Data Analysis
                  </h3>
                  <div className='mb-4 flex items-center'>
                    <span className='rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800'>
                      Intermediate
                    </span>
                    <span className='ml-3 text-sm text-gray-500'>6 Weeks</span>
                  </div>
                  <p className='mb-6 text-gray-600'>
                    Master advanced queries and data manipulation techniques for
                    business analytics and reporting.
                  </p>
                  <ul className='mb-6 space-y-2'>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      JOINs and Subqueries
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Aggregation Functions
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Window Functions
                    </li>
                  </ul>
                </div>
              </div>

              {/* Track 3 */}
              <div className='overflow-hidden rounded-lg bg-white shadow-md'>
                <div className='h-2 bg-purple-600'></div>
                <div className='p-6'>
                  <h3 className='mb-2 text-xl font-semibold'>
                    Advanced SQL Mastery
                  </h3>
                  <div className='mb-4 flex items-center'>
                    <span className='rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800'>
                      Advanced
                    </span>
                    <span className='ml-3 text-sm text-gray-500'>8 Weeks</span>
                  </div>
                  <p className='mb-6 text-gray-600'>
                    Dive deep into performance optimization, stored procedures,
                    and database design principles.
                  </p>
                  <ul className='mb-6 space-y-2'>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Query Optimization
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Stored Procedures
                    </li>
                    <li className='flex items-center text-sm text-gray-600'>
                      <svg
                        className='mr-2 h-4 w-4 text-green-500'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Transaction Management
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className='bg-indigo-700 py-20 text-center text-white'>
          <div className='mx-auto max-w-4xl px-6'>
            <h2 className='mb-6 text-3xl font-bold'>Ready to Master SQL?</h2>
            <p className='mb-10 text-lg'>
              Join thousands of students who have accelerated their careers with
              our comprehensive SQL curriculum.
            </p>
            <Button
              className='rounded-md bg-white px-8 py-3 font-medium text-indigo-700 transition hover:bg-gray-100'
              onPress={() => router.push('/learn')}
            >
              Start Your Free Trial
            </Button>
          </div>
        </section>
        {/* Footer */}
        <footer className='bg-gray-800 py-8 text-white'>
          <div className='mx-auto max-w-6xl px-6'>
            <div className='flex flex-col justify-between space-y-8 md:flex-row md:space-y-0'>
              <div className='py-2 md:w-1/3'>
                <h4 className='text-xl font-bold'>SQL Tutor</h4>
                <p className='mt-2'>
                  Empowering data professionals through interactive SQL
                  education.
                </p>
              </div>
              <div>
                <h4 className='font-bold'>Learning</h4>
                <ul className='mt-4 space-y-2'>
                  <li>Courses</li>
                  <li>Tutorials</li>
                  <li>Resources</li>
                </ul>
              </div>
              {/* <div>
                <h4 className='font-bold'>Company</h4>
                <ul className='mt-4 space-y-2'>
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blog</li>
                  <li>Contact</li>
                </ul>
              </div>
              <div>
                <h4 className='font-bold'>Legal</h4>
                <ul className='mt-4 space-y-2'>
                  <li>Terms</li>
                  <li>Privacy</li>
                  <li>Cookies</li>
                </ul>
              </div> */}
            </div>
            <div className='mt-8 text-center'>
              <p>&copy; 2025 SQL Tutor. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </ScrollShadow>
    </div>
  );
}
