# 💼 Job Hunt

## 🔗 Live Link  
 https://job-hunt-ekpz.onrender.com

## 📌 Description  
**Job Hunt** is a full-stack **MERN web application** built to bridge the gap between **job seekers and recruiters**. Users can explore job opportunities, apply, and manage their profiles. Recruiters can create job posts, manage applicants, and schedule interviews. The platform features an intuitive **admin dashboard** that offers insights into system activity, application outcomes, and recruitment trends. A secure, responsive, and role-based system ensures a smooth and scalable user experience for everyone involved.

## ✨ Features  
- 👨‍💻 Job seekers can register, apply for jobs, and update profiles  
- 🏢 Recruiters can post job openings, view applicants, and schedule interviews  
- 🔐 Role-based authentication for seekers, recruiters, and admins  
- 📊 Admin dashboard with user/job stats and trend visualizations  
- 📧 Email notifications for application updates and account actions  
- ⚙️ Secure JWT-based login and Redux state management  
- 📱 Fully responsive UI for mobile and desktop  

## 🛠️ Technologies Used  
- **React.js** – Frontend UI  
- **Node.js** – Runtime environment  
- **Express.js** – RESTful backend API  
- **MongoDB** – Database  
- **Redux Toolkit** – Application state management  
- **Chart.js** – Interactive data visualizations  
- **JWT & bcrypt** – Authentication and encryption  
- **Nodemailer** – Email functionality  
- **React Router** – Client-side routing  

## ⚙️ Installation  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Maruf-ult/Job_Hunt
   
2. Open the terminal in the repository folder:
 
   ```
   cd Job_portal
    ```

3. Install backend dependencies:

   ```
   cd server_site
   npm install
    ```

4. Install frontend dependencies:
   
   ```
   cd client_site
   npm install
     ```
5. Configure environment variables
     Create a .env file in the server directory with the following:

     ```
       MONGO_URI=your_mongo_db_connection_string
       JWT_SECRET=your_jwt_secret
       SMTP_EMAIL=your_email@example.com
       SMTP_PASS=your_smtp_password
   
     ```
    
6. Configure MongoDB:
- Create an account on MongoDB Compass.
- Create a database and obtain your MongoDB URI.
- Create a `.env` file in the root directory and add your MongoDB URI:

  ```  MONGO_URI=your_mongodb_uri  ```
  

7. Run the backend application:
   
   ```
   cd server_site
   npm start
   ```

8. Run the frontend application:
   
   ```
   cd client_site
   npm run dev
   ```   

   

Feel free to adapt this template to your project's specific requirements. Happy coding! 🚀

: GitHub - Maruf-ult/Job_portal
