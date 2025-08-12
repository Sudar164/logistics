# 🚚 GreenCart Logistics

**GreenCart Logistics** is a modern, full-stack logistics management platform that allows businesses to **simulate deliveries**, **manage drivers and routes**, and monitor **real-time KPIs** via an interactive dashboard.  
It features a **modern React frontend** with TailwindCSS, **Node.js/Express backend APIs**, and **chart-based visualizations** for operational insights.

---

## 📌 Features

### Frontend
- 🖥 **Modern UI** with glass-morphism, gradients & animations
- 📊 **Interactive Dashboard** with KPI cards & charts:
  - Total Profit & Efficiency Score
  - On-time vs Late Deliveries
  - Fuel Cost Breakdown
- 🗂 **Simulation Module**:
  - Select drivers with fatigue analysis
  - Run simulations with route time & hours config
  - View simulation results in tables & charts
- 🔑 **Authentication** (Register/Login)
  - Role-based selection (Admin/Manager)
- 📱 Responsive design for Desktop & Mobile

### Backend
- 📡 RESTful APIs for:
  - Driver Management (`driversAPI`)
  - Run & store simulations (`simulationAPI`)
  - Fetch history & analytics
- 🗄 MongoDB (or similar NoSQL DB) for persistence
- 🔐 Authentication & Authorization support (via API)

---

## 🛠 Tech Stack

### Frontend
- React.js (Functional Components + Hooks)
- Tailwind CSS
- Chart.js + react-chartjs-2
- React Router
- React Hook Form
- Heroicons
- React Hot Toast

### Backend
- Node.js + Express.js
- MongoDB + Mongoose (assumed)
- JWT Authentication (assumed)
- REST API architecture

---


greencart-logistics/
│
├── frontend/ # React app source
│ ├── src/
│ │ ├── components/ # Navbar, Sidebar, KPIs, Charts
│ │ ├── pages/ # Dashboard, Simulation, Login, Register
│ │ ├── contexts/ # Auth context
│ │ ├── services/ # API wrappers
│ │ └── styles/ # Tailwind styles
│ └── public/
│
├── backend/ # Node.js Express API
│ ├── models/ # Mongoose Schemas
│ ├── routes/ # API routes
│ ├── controllers/ # API logic
│ ├── middleware/ # Auth & error handling
│ └── config/ # Env & DB config
│
└── README.md # Project documentation




---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/greencart-logistics.git
cd greencart-logistics



### 2️⃣ Install Dependencies

**Frontend**
cd frontend
npm install



**Backend**
cd backend
npm install


---

### 3️⃣ Environment Variables

**Frontend `.env`**
VITE_APP_NAME=GreenCart Logistics
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:5000/api



**Backend `.env`**
PORT=5000
MONGO_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your_jwt_secret


---

### 4️⃣ Run the Application

**Frontend (React)**
cd frontend
npm run dev


**Backend (Node.js)**
cd backend
npm start


---

## 🧩 API Endpoints

### Drivers
- `GET /api/drivers` → Fetch all active drivers
- `POST /api/drivers` → Add new driver

### Simulations
- `POST /api/simulations/run` → Run a simulation
- `GET /api/simulations/history` → Get previous simulations

---

## 📌 Development Notes
- Built with **component reusability** in mind
- Fully responsive UI for mobile and large screens
- Uses **Toast notifications** for quick feedback
- Charts are **animated** and **accessible**

---

## 🤝 Contributing

1. **Fork** the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add a cool feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 License
This project is licensed under the MIT License.

---

## 💡 Author
Created and maintained by Sudaroli G • [GitHub Profile](https://github.com/Sudar164)










## 📂 Project Structure

