/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Course, User, Quiz, Notification, Certificate } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
  joinedDate: 'Jan 2024',
  enrolledCourses: ['c1', 'c2']
};

export const MOCK_INSTRUCTOR: User = {
  id: 'i1',
  name: 'Dr. Sarah Chen',
  email: 'dr.chen@learnflow.ai',
  role: 'teacher',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
  bio: 'Former Senior AI Researcher at DeepMind with 10+ years of teaching experience in Neural Networks.',
  joinedDate: 'Mar 2023'
};

const LOREM_CONTENT = "This lesson covers the fundamental concepts needed to master this topic. We will dive deep into the architecture, implementation details, and best practices used in the industry today.";

export const MOCK_COURSES: Course[] = [];

export const MOCK_QUIZ: Quiz = {
  id: 'q1',
  title: 'Neural Networks Basics',
  description: 'Test your knowledge on the fundamental building blocks of AI.',
  timeLimit: 10,
  questions: [
    {
      id: 'q1-1',
      text: 'What is the primary function of an activation function in a neural network?',
      options: [
        'To reduce the number of neurons',
        'To introduce non-linearity',
        'To speed up training',
        'To normalize the dataset'
      ],
      correctAnswer: 1,
      explanation: 'Without non-linearity, a neural network would just be a series of linear transformations, which is equivalent to a single linear layer.'
    },
    {
      id: 'q1-2',
      text: 'In backpropagation, which mathematical principle is used to update weights?',
      options: [
        'The Chain Rule',
        'The Pythagorean Theorem',
        'Boyle\'s Law',
        'Heisenberg Uncertainty Principle'
      ],
      correctAnswer: 0,
      explanation: 'The Chain Rule allows us to calculate the derivative of the loss function with respect to the weights of the network.'
    }
  ]
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New Course Release', message: 'Mastering Framer Motion is now available!', time: '2h ago', type: 'course', read: false },
  { id: 'n2', title: 'Quiz Passed!', message: 'You scored 95% on "Intro to React".', time: '5h ago', type: 'quiz', read: true }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  { id: 'cert1', courseTitle: 'React Fundamentals', date: 'March 15, 2024', studentName: 'Alex Rivera', verificationCode: 'LF-A1B2-C3D4' }
];

export const BRAND_NAME = 'LearnFlow AI';
export const PRIMARY_COLOR = '#6366f1'; 
export const ACCENT_COLOR = '#a855f7';
export const BACKGROUND_COLOR = '#F5F2EB';
export const SURFACE_COLOR = '#FFFFFF';
export const TEXT_COLOR = '#2C2A26';