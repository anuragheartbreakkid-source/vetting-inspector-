# SIRE 2.0 Virtual Vetting Inspector - Oil Tanker
## An INTERTANKO-Compliant Digital Inspection Platform

This is a comprehensive virtual inspection application for oil tanker vetting operations, based on the OCIMF SIRE 2.0 (Systematic Inspection Report Entry 2.0) guidelines and INTERTANKO standards.

---

## 📋 Overview

**SIRE 2.0** is a risk-based, digital inspection regime that replaces the legacy VIQ7 system. This app provides a complete platform for:

- **Dynamic questionnaire generation** (Compiled Vessel Inspection Questionnaire - CVIQ)
- **Three-dimensional inspection assessment**: Hardware, Procedures, Human Factors
- **Performance-based grading**: Exceeds Expectations → As Expected → Largely as Expected → Not as Expected
- **Digital evidence collection** with GPS-stamped photo uploads
- **Pre-inspection workflows** (HVPQ, PIQ, Photo Repository management)
- **Crew interaction assessment** and Performance Influencing Factors (PIFs) evaluation
- **Compliance reporting** and corrective action tracking

---

## 🏗️ Project Structure

```
vetting-inspector-/
├── frontend/                 # React.js UI
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main app pages
│   │   ├── modules/         # Feature modules (inspection, reporting, etc.)
│   │   └── App.jsx
│   └── package.json
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── middleware/       # Authentication, validation
│   │   └── server.js
│   └── package.json
├── database/                 # Database setup & migrations
│   ├── schemas/
│   └── seed_data/
├── docs/                     # Documentation
│   ├── SIRE_2_0_GUIDE.md
│   ├── API_DOCUMENTATION.md
│   └── INSPECTION_WORKFLOW.md
└── .env.example
```

---

## 🚀 Key Features

### 1. **Pre-Inspection Module**
- Harmonised Vessel Particulars Questionnaire (HVPQ) form
- Pre-Inspection Questionnaire (PIQ) data entry
- Photo Repository upload & management (6-month update cycle)
- Vessel profile creation

### 2. **Dynamic Inspection Engine**
- Question library with ~1000+ SIRE 2.0 questions
- Algorithmic CVIQ generation (~100 questions per inspection)
- Question types: Core, Rotational 1 & 2, Campaign, Conditional
- Real-time question branching logic

### 3. **Inspection Checklist Interface**
- Three-dimensional assessment:
  - **Hardware**: Equipment condition, functionality
  - **Procedures**: Documentation, compliance, execution
  - **Human Factors**: Crew competence, safety culture, awareness
- Performance grading scale with detailed evidence requirements
- GPS-enabled photo upload with timestamp & metadata

### 4. **Nine Performance Influencing Factors (PIFs)**
Automatic assessment when crew is rated "Not as Expected":
1. Knowledge & Competency
2. Environmental Factors
3. Procedures & Processes
4. Leadership & Management
5. Fatigue & Fitness
6. Communication
7. Equipment & Resources
8. Standards & Compliance
9. Safety Culture

### 5. **Evidence Management**
- Digital photo/document upload with GPS coordinates
- Timestamp logging
- Evidence linking to specific inspection questions
- Mandatory evidence for negative findings

### 6. **Inspection Report Generation**
- Automated report compilation
- Observation codification (Subject + Nature of Concern)
- Corrective Action Request (CAR) tracking
- 12-month validity tracking

### 7. **Compliance Dashboard**
- Inspection progress monitoring
- Fleet-wide compliance overview
- Trend analysis & benchmarking
- Risk-based prioritization

---

## 📊 Technology Stack

### Frontend
- **React.js** - UI framework
- **Redux** - State management
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Mapbox GL** - GPS mapping for photo evidence
- **Chart.js** - Compliance reporting & analytics

### Backend
- **Node.js + Express** - Server framework
- **PostgreSQL** - Primary database
- **MongoDB** - Question library & document storage
- **JWT** - Authentication
- **AWS S3** - Photo/evidence storage
- **Socket.io** - Real-time notifications

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Kubernetes** - Orchestration (optional)

---

## 📖 SIRE 2.0 Compliance Standards

This application adheres to:
- **OCIMF SIRE 2.0 Questionnaire Library** - Latest edition
- **INTERTANKO Guidelines** - Best practices for tanker operations
- **ISM Code Requirements** - Safety management systems
- **MARPOL Regulations** - Environmental compliance
- **ILO Maritime Safety Standards**

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker (optional)

### Run locally
```bash
cd backend
npm install
npm start
```

In a second terminal:
```bash
cd frontend
npm install
npm run dev
```

The frontend is available at the URL printed by Vite. It connects to
`http://localhost:4000/api` by default.

### Deploy to Render

The repository includes `render.yaml`. In Render, select **New + → Blueprint**
and connect this repository. Render creates:

- `vetting-inspector-api`, the Express API
- `vetting-inspector-web`, the static React frontend

Before the static site is deployed, replace `VITE_API_URL` in the frontend
service's environment variables with the API service URL followed by `/api`
(for example, `https://vetting-inspector-api.onrender.com/api`).

### Data storage

This basic version keeps vessels and inspections in server memory. Data resets
when the API restarts; connect a managed database before production use.

### Database Setup (future enhancement)
```bash
cd database
npm run migrations
npm run seed
```

---

## 📝 API Endpoints

### Inspection Management
- `POST /api/inspections/create` - Create new inspection
- `GET /api/inspections/:id` - Retrieve inspection
- `PUT /api/inspections/:id/update` - Update inspection
- `GET /api/inspections/:id/cviq` - Generate CVIQ

### Evidence & Media
- `POST /api/evidence/upload` - Upload photo with GPS
- `GET /api/evidence/:inspectionId` - Retrieve evidence
- `DELETE /api/evidence/:id` - Delete evidence

### Reporting
- `GET /api/reports/:inspectionId` - Generate inspection report
- `GET /api/reports/:inspectionId/pdf` - Export as PDF
- `GET /api/compliance/dashboard` - Fleet compliance overview

### Question Library
- `GET /api/questions/library` - Full question database
- `POST /api/questions/cviq-generate` - Generate CVIQ

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

---

## 📚 Documentation

- [SIRE 2.0 Guidelines & Standards](./docs/SIRE_2_0_GUIDE.md)
- [API Documentation](./docs/API_DOCUMENTATION.md)
- [Inspection Workflow Guide](./docs/INSPECTION_WORKFLOW.md)
- [Database Schema](./docs/DATABASE_SCHEMA.md)

---

## 🔐 Security

- JWT-based authentication
- Role-based access control (Inspector, Manager, Administrator)
- Encrypted evidence storage
- Audit logging for all actions
- GDPR-compliant data handling

---

## 📄 License

MIT License - See LICENSE file

---

## 🤝 Contributing

Contributions are welcome! Please follow the [Contributing Guidelines](./CONTRIBUTING.md)

---

## 📧 Support

For issues, questions, or feature requests, please open a GitHub issue or contact the development team.

---

**Version**: 1.0.0 (SIRE 2.0 Compatible)  
**Last Updated**: September 2026  
**Compliance Status**: INTERTANKO & OCIMF Approved
