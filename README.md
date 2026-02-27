# CRM Application

A production-ready, scalable CRM (Customer Relationship Management) web application built with modern technologies, similar to Salesforce or HubSpot.

## 🚀 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin, Sales, Support)
- Protected routes
- Token expiration handling

### Dashboard
- Real-time statistics (Total Leads, Active Deals, Revenue, Pipeline Value)
- Monthly revenue charts
- Deal conversion rate tracking
- Recent activity feed
- Deals by stage visualization

### Leads Management
- Create, read, update, and delete leads
- Lead status tracking (New, Contacted, Qualified, Won, Lost)
- Assign leads to team members
- Search and filter functionality
- Pagination support
- Notes system for each lead

### Contacts Management
- Full CRUD operations for contacts
- Link contacts to leads
- Contact notes
- Email and phone tracking
- Search functionality

### Deals Pipeline
- Kanban board with drag-and-drop
- Visual pipeline stages (Lead → Qualified → Proposal → Negotiation → Closed Won/Lost)
- Deal value tracking
- Expected close date
- Automatic activity logging on stage changes
- Link deals to leads and contacts

### Activity Logging
- Comprehensive activity tracking
- User attribution
- Timestamp tracking
- Activity type categorization

### Notifications
- In-app notification system
- Real-time notification dropdown
- Unread notification badges
- Automatic notifications for lead/deal assignments

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons
- **Recharts** for data visualization
- **@dnd-kit** for drag-and-drop functionality
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Express Rate Limit** for API protection
- **Express Validator** for input validation

## 📁 Project Structure

```
crm-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── leadController.js
│   │   ├── contactController.js
│   │   ├── dealController.js
│   │   ├── activityController.js
│   │   ├── notificationController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Contact.js
│   │   ├── Deal.js
│   │   ├── Activity.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── dealRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── error.js
│   │   └── validate.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── logActivity.js
│   │   └── createNotification.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Select.jsx
    │   │   ├── Card.jsx
    │   │   ├── Modal.jsx
    │   │   ├── Loader.jsx
    │   │   ├── StatCard.jsx
    │   │   ├── DealCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── AppContext.jsx
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Leads.jsx
    │   │   ├── Contacts.jsx
    │   │   └── Deals.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── leadService.js
    │   │   ├── contactService.js
    │   │   ├── dealService.js
    │   │   └── dashboardService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
```

5. Start MongoDB (if running locally):
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

6. Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```env
VITE_API_URL=http://localhost:5000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `GET /api/auth/users` - Get all users (Protected)

### Leads
- `GET /api/leads` - Get all leads (Protected)
- `GET /api/leads/:id` - Get single lead (Protected)
- `POST /api/leads` - Create lead (Protected)
- `PUT /api/leads/:id` - Update lead (Protected)
- `DELETE /api/leads/:id` - Delete lead (Protected)
- `POST /api/leads/:id/notes` - Add note to lead (Protected)

### Contacts
- `GET /api/contacts` - Get all contacts (Protected)
- `GET /api/contacts/:id` - Get single contact (Protected)
- `POST /api/contacts` - Create contact (Protected)
- `PUT /api/contacts/:id` - Update contact (Protected)
- `DELETE /api/contacts/:id` - Delete contact (Protected)
- `POST /api/contacts/:id/notes` - Add note to contact (Protected)

### Deals
- `GET /api/deals` - Get all deals (Protected)
- `GET /api/deals/:id` - Get single deal (Protected)
- `POST /api/deals` - Create deal (Protected)
- `PUT /api/deals/:id` - Update deal (Protected)
- `DELETE /api/deals/:id` - Delete deal (Protected)
- `PATCH /api/deals/:id/stage` - Update deal stage (Protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (Protected)

### Activities
- `GET /api/activities` - Get recent activities (Protected)

### Notifications
- `GET /api/notifications` - Get user notifications (Protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (Protected)
- `PUT /api/notifications/read-all` - Mark all as read (Protected)

## 🚀 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=<your-mongodb-atlas-uri>`
   - `JWT_SECRET=<your-secret-key>`
   - `JWT_EXPIRE=30d`
   - `PORT=5000`

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory and deploy:
```bash
cd frontend
vercel
```

3. Add environment variable:
   - `VITE_API_URL=<your-backend-url>`

Alternatively, connect your GitHub repository directly to Vercel:
- Go to [Vercel Dashboard](https://vercel.com)
- Import your repository
- Set root directory to `frontend`
- Add environment variable `VITE_API_URL`
- Deploy

### MongoDB Atlas (Free Tier)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and update `MONGO_URI` in backend

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation
- MongoDB injection prevention

## 👥 Default User Roles

- **Admin**: Full access to all features
- **Sales**: Access to leads, contacts, and deals
- **Support**: Limited access based on assignments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ for modern CRM needs

## 🐛 Known Issues

- None reported yet

## 📞 Support

For support, please open an issue in the repository.
