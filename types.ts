/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  avatar: string;
  bio?: string;
  joinedDate: string;
  enrolledCourses?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'article' | 'assignment';
  duration: string;
  completed?: boolean;
  content?: string;
  videoUrl?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  price: number | 'Free';
  duration: string;
  lessonsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  description: string;
  longDescription: string;
  curriculum: CourseSection[];
  whatYouWillLearn: string[];
  lastUpdated: string;
  isAI?: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of option
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'course' | 'quiz' | 'message' | 'system';
  read: boolean;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  date: string;
  studentName: string;
  verificationCode: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState = 
  | { type: 'landing' }
  | { type: 'login' }
  | { type: 'signup' }
  | { type: 'student-dashboard' }
  | { type: 'instructor-dashboard' }
  | { type: 'course-catalog' }
  | { type: 'course-detail'; course: Course }
  | { type: 'course-player'; course: Course; activeLessonId: string }
  | { type: 'quiz'; quiz: Quiz; courseId: string }
  | { type: 'course-create' }
  | { type: 'certificates' }
  | { type: 'ai-tutor' }
  | { type: 'settings' }
  | { type: 'my-courses' }
  | { type: 'quiz-results' };
