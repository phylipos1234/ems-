# Employee Management System (EMS)

A full-stack Employee Management System built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Employee Management**: Add, edit, view, and delete employees
- **Department Management**: Organize employees by departments
- **Salary Management**: Track and manage employee salaries
- **User Authentication**: Secure login and registration
- **Role-based Access**: Admin and Employee dashboards
- **File Uploads**: Profile image uploads for employees

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Hook Form

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (File Uploads)
- Bcrypt (Password Hashing)

## 📁 Project Structure

```
ems/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API configuration
│   │   ├── store/         # Redux store
│   │   └── routes/        # Route configurations
│   └── package.json
├── server/            # Express backend
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── router/        # API routes
│   ├── middleware/    # Custom middleware
│   └── db/            # Database configuration
├── api/               # Vercel serverless function wrapper
├── vercel.json        # Vercel configuration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ems.git
   cd ems
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Set Up Environment Variables**

   Create `server/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start Backend Server**
   ```bash
   cd server
   npm start
   # Server runs on http://localhost:5000
   ```

6. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 📦 Deployment

### Deploy to Vercel

This application is configured for deployment on Vercel. Follow these guides:

1. **[GitHub Setup Guide](./GITHUB_SETUP.md)** - Push your code to GitHub
2. **[Vercel Deployment Steps](./VERCEL_DEPLOYMENT_STEPS.md)** - Complete deployment guide
3. **[Deployment Documentation](./DEPLOYMENT.md)** - Detailed deployment information

### Quick Deployment Checklist

- [ ] Push code to GitHub
- [ ] Set up MongoDB Atlas
- [ ] Create Vercel account
- [ ] Import project to Vercel
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and test

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ems
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env)
```env
VITE_API_URL=https://your-app.vercel.app/api
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password (protected)

### Departments
- `GET /api/department` - Get all departments (protected)
- `GET /api/department/:id` - Get department by ID (protected)
- `POST /api/department/add` - Add new department (protected)
- `PUT /api/department/:id` - Update department (protected)
- `DELETE /api/department/:id` - Delete department (protected)

### Employees
- `GET /api/employee` - Get all employees (protected)
- `GET /api/employee/:id` - Get employee by ID (protected)
- `POST /api/employee/add` - Add new employee (protected)
- `PUT /api/employee/:id` - Update employee (protected)
- `DELETE /api/employee/:id` - Delete employee (protected)

### Salaries
- `GET /api/salary` - Get all salaries (protected)
- `GET /api/salary/:id` - Get salary by ID (protected)
- `POST /api/salary/add` - Add new salary (protected)
- `PUT /api/salary/:id` - Update salary (protected)
- `DELETE /api/salary/:id` - Delete salary (protected)

## 🧪 Testing

```bash
# Run frontend linter
cd frontend
npm run lint

# Test API endpoints (use Postman or similar)
# Base URL: http://localhost:5000/api
```

## 📚 Documentation

- [GitHub Setup Guide](./GITHUB_SETUP.md)
- [Vercel Deployment Steps](./VERCEL_DEPLOYMENT_STEPS.md)
- [Deployment Documentation](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- React Team
- Express.js
- MongoDB
- Vercel

---

**Note**: For production deployment, make sure to:
- Use strong JWT secrets
- Configure CORS properly
- Use environment variables for sensitive data
- Set up proper error handling
- Implement file storage solution (S3, Cloudinary, etc.) for uploads

