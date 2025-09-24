# FarmPlot Application

A complete farm monitoring system with React frontend and Node.js backend, featuring real-time sensor data, alert management, and threshold configuration.

## 🏗️ Architecture

- **Frontend**: React with Material-UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with PostGIS
- **Deployment**: Docker with GitHub Actions CI/CD

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd farmplot
   ```

2. **Start all services (locally)**:
   ```bash
   docker-compose -f docker-compose.local.yml up --build 
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:5433

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
POSTGRES_DB=farmplot
POSTGRES_USER=farmplot_user
POSTGRES_PASSWORD=your_secure_password

# Email (Optional)
ALERT_EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=no-reply@farmplot.com
ALERT_EMAIL_RECIPIENTS=admin@yourcompany.com

# Webhook (Optional)
ALERT_WEBHOOK_ENABLED=true
ALERT_WEBHOOK_URL=https://your-webhook-url.com/alerts
ALERT_WEBHOOK_API_KEY=your-webhook-api-key
```

## 🏠 Local Development

For local development with building from source:

```bash
# Start all services (builds locally)
docker-compose -f docker-compose.local.yml up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432
```

## 📱 Features

### Frontend (React + Material-UI)
- **Farm Overview**: Dashboard with plot counts and status
- **Plot Management**: List view with status indicators
- **Sensor Data Charts**: Real-time data visualization
- **Alert Management**: Acknowledge/dismiss alerts
- **Threshold Configuration**: Edit sensor thresholds
- **Mobile Responsive**: Auto-minimizing sidebar

### Backend (Node.js + Express)
- **REST API**: Complete CRUD operations
- **Real-time Alerts**: Threshold-based alert system
- **Email Notifications**: SMTP integration
- **Webhook Delivery**: HTTP webhook support
- **PostGIS Support**: Geographic data handling
- **Data Validation**: Joi schema validation



## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
1. **Build**: Creates Docker images for both frontend and backend
2. **Push**: Uploads images to GitHub Container Registry
3. **Deploy**: Deploys to EC2 using AWS SSM

### Required Secrets
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `EC2_INSTANCE_ID`
- `GHCR_TOKEN`
- `REACT_APP_API_URL`

## 📊 API Endpoints

### Farms
- `GET /v1/farms` - List all farms
- `GET /v1/farms/:id` - Get farm details
- `POST /v1/farms` - Create farm
- `PUT /v1/farms/:id` - Update farm
- `DELETE /v1/farms/:id` - Delete farm

### Plots
- `GET /v1/plots` - List all plots
- `GET /v1/plots/:id` - Get plot details
- `GET /v1/farms/:farmId/plots` - Get plots by farm
- `PUT /v1/plots/:id/thresholds` - Update thresholds

### Sensor Data
- `GET /v1/sensor-data/plot/:plotId/last24hours` - Last 24h data
- `GET /v1/sensor-data/plot/:plotId/latest` - Latest data
- `POST /v1/sensor-data` - Create sensor reading

### Alerts
- `GET /v1/alerts` - List all alerts
- `PUT /v1/alerts/:id` - Update alert status

## 🛠️ Development

### Backend Development
```bash
cd core
yarn install
yarn run migrate
yarn run seed
yarn start
```

### Frontend Development
```bash
cd dashboard
npm install
npm run start
```

### Database Management
```bash
# Run migrations
yarn run migrate

# Seed database
yarn run seed

# Reset database
yarn run migrate:rollback
yarn run migrate
yarn run seed
```

## 🚀 Deployment

### EC2 Deployment
1. **Setup EC2 instance** with Docker and SSM agent
2. **Configure GitHub secrets** for AWS access
3. **Push to main branch** to trigger deployment
4. **Access application** at EC2 public IP



## 📁 Project Structure

```
farmplot/
├── core/                    # Backend API
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── validations/    # Joi schemas
│   │   └── migrations/     # Database migrations
│   ├── Dockerfile
│   └── package.json
├── dashboard/              # Frontend React app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── theme/         # Material-UI theme
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/workflows/      # CI/CD pipeline
├── docker-compose.yml      # Development setup
├── docker-compose.prod.yml # Production setup
└── README.md
```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```


