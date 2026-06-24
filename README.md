# StudyPath

**StudyPath** is a full-stack AI tutoring and practice web application. This app allows students to create an account, log in securely if they already do have an account, ask academic question ranging from 
kindegarten through 12th grade, receive an AI-generated step-by-step tutoring response, and save their learning history for later review. 

The goal of this application, is to make studying more interactive and personalized. Instead of only giving a final answer, that some generative AI may do, the AI tutor explains concepts clearly, adjusts responses
based on the selected grade level, and supports different learning modes, such as explanations, quizzes, practice problems, study plans, simplified explanations, and finally writing coaching. 

## Features 

**User Authentication** 

- Users can sign up with a username, email, and password seamlessly. 
- Returning users can log in with their email and password. 
- Passwords are hashed using bcrypt before being stored in the database.
- JWT authentication is used to protect private app routes.
- Logged-in users can access both the dashboard and history pages. 
- Logged-out users are redirected to the login page if they try to access protected pages. 


**AI Tutor Dashboard**

- Users can enter any academic question. 
- Users can choose a subject.
- Users can choose a grade level from kindergarten through college. 
- Users can choose and change the learning mode. 
- The app sens the questions and learning preferences to an AI API.
- The AI returns a structured tutoring response.
- Responses are displayed clearly and consicely on the dashboard using the rules set in tutorRoutes.js

## Learning Modes

- Explain This: Gives a clear step-step explanation.
- Practice Problems: Creates similar practice problems to the original question.
- Quiz Me: Generates a short quiz for review.
- Simplify It: Explains the concept in a beginner-friendly language so it isn't too complicated.
- Study Plan: Creates a study plan for whatever topic that the user chose.
- Writing Coach: Givies writing feedback and improvement suggestions


## Tech Stack 


**Frontend:** React, Vite, React, Router, Axios, CSS
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
**Authentication:** JWT, bcryptjs
**AI API:** OpenRouter API
**AI Model:** cohere/north-mini-code:free

## Database Persistence 

**Create:** Asking the AI tutor creates a new saved tutor session.
**Read:** The History page displays saved sessions.
**Update:** Users can edit saved session titles.
**Delete:** Users can delete saved sessions.

## API Routes

**Authentication:** 

POST /api/auth/signup
POST /api/auth/login

**Tutor Sessions**

POST /api/tutor/ask
GET /api/tutor/sessions
GET /api/tutor/sessions/:id
PUT /api/tutor/sessions/:id
DELETE /api/tutor/sessions/:id

## Security 

- Passwords are hashed with bcrypt before being stsored
- JWT tokens protect private routes
- Users can only access their own tutor sessions
- Environment variables are stored in .env and should not be pushed in GitHub


**Frontend URL:** https://studypath-frontend.onrender.com  
**Backend URL:** https://studypath-backend.onrender.com  

## Test email, username and password 

**Email:** professor@test.com
**Password:** professor123
**Username:** professor

