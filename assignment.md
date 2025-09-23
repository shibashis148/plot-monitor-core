# Farm Plot Monitoring - Technical Assessment (3 Days)

## Objective

Build a **minimal viable farm plot monitoring system** demonstrating full-stack development* (please refer to note in the email), containerization, and CI/CD deployment.

## Core Requirements

### 1. Backend API (Node.js/Express)

- **5 REST endpoints**:
    - `GET /farms` - List farms with basic plot counts
    - `GET /farms/:id/plots` - List all plots for a farm
    - `POST /sensor-data` - Receive sensor readings
    - `GET /plots/:id/alerts` - Get alerts for a plot
    - `POST /alerts/:id/acknowledge` - Acknowledge/dismiss alerts
- **PostgreSQL database** with 4 tables: `farms`, `plots`, `sensor_data`, `alerts`
- **Database migrations** using a migration tool (e.g., knex.js, sequelize, or raw SQL)
- **GIS data handling**: Store farm/plot boundaries (PostGIS or GeoJSON approach)
- **Alert Engine**: Automated system that processes incoming sensor data and generates alerts based on configurable thresholds
- **Alert Delivery Strategy**: Design and implement at least one delivery method (email, webhook, or in-app notifications)
- **Basic validation** and error handling

### 2. Frontend Dashboard (React)

- **Farm overview** with plot count and status summary
- **Plot list view** for selected farm showing status (healthy/warning/critical)
- **Simple sensor data chart** for selected plot (last 24 hours)
- **Alert management panel** with acknowledge/dismiss functionality
- **Alert notifications** display with visual indicators
- **Mobile responsive** design

### 3. Containerization & Deployment

- **Docker containers** for frontend, backend, and database
- **Docker Compose** for local development
- **Deploy to provided AWS EC2** instance

### 4. CI/CD Pipeline

- **GitHub Actions** workflow that:
    - Runs on push to `main` branch
    - Builds Docker images
    - **Handles database migrations** safely
    - Deploys to AWS EC2
    - Includes basic health checks

## Database Schema (Simple)

```sql
farms: id, name, owner_name, location (point), boundary (polygon), total_area, created_at
plots: id, farm_id, name, plot_number, boundary (polygon), area, crop_type, status, alert_thresholds (jsonb), created_at
sensor_data: id, plot_id, temperature, humidity, soil_moisture, timestamp
alerts: id, plot_id, alert_type, message, severity, status, delivered_at, acknowledged_at, created_at
```

**Note**: Use PostGIS extension for geometry/geography types, or store as GeoJSON in TEXT/JSONB fields if PostGIS setup is complex.

## Alert Engine Requirements

- **Configurable thresholds** per plot (e.g., soil moisture < 30%, temperature > 35°C)
- **Alert processing** triggered when new sensor data arrives
- **Duplicate prevention** (don't create multiple alerts for same condition)
- **Alert delivery mechanism** with delivery status tracking
- **Alert acknowledgment** system for farm managers

## Deliverables

1. **Public GitHub repo** with clear README
2. **Live application** deployed on AWS EC2
3. **Working CI/CD pipeline** with DB migrations
4. **Sample data** (1-2 farms with 2-3 plots each, different alert thresholds, 48 hours of sensor readings, triggered alerts)
5. **GIS data handling documentation** explaining boundary storage approach
6. **Alert delivery documentation** explaining chosen strategy and implementation
7. **Brief AI usage notes** in README

## Success Criteria

- ✅ Application runs via Docker Compose locally
- ✅ Database migrations run automatically in CI/CD pipeline
- ✅ Farm-plot hierarchical relationship properly implemented
- ✅ GIS boundary data stored and retrievable (PostGIS or GeoJSON)
- ✅ Alert engine processes sensor data and generates alerts correctly
- ✅ Alert delivery mechanism works (with delivery status tracking)
- ✅ Successful deployment to AWS EC2 via CI/CD
- ✅ Frontend displays farm overview and plot management
- ✅ Clean, documented code with proper Git practices
- ✅ Evidence of AI tool usage in development

## Timeline

- **Day 1**: Setup, database design with migrations, basic API, alert engine logic
- **Day 2**: Frontend, alert management UI, Docker containers, integration
- **Day 3**: Alert delivery implementation, CI/CD pipeline with DB migration handling, AWS deployment, documentation

## Tech Stack (Required)

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React (create-react-app is fine)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: AWS EC2 (provided)

---

**Focus on working software over perfect code. We want to see your development process and deployment skills.**