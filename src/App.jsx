import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Loading from "./components/Loading";

/* Pages */
const Dashboard = lazy(() => import("./pages/Dashboard"));

// Patient Pages
const Patients = lazy(() => import("./pages/Patients"));
const PatientDetail = lazy(() => import("./pages/PatientDetail"));
const AddPatients = lazy(() => import("./pages/AddPatients"));
const AddPatientPreview = lazy(() => import("./pages/AddPatientPreview"));

// Schedule Pages
const Schedule = lazy(() => import("./pages/Schedule"));
const ScheduleDetail = lazy(() => import("./pages/ScheduleDetail"));
const AddSchedule = lazy(() => import("./pages/AddSchedule"));
const SchedulePreview = lazy(() => import("./pages/SchedulePreview"));

// Financial Pages
const Transactions = lazy(() => import("./pages/Transactions"));
const TransactionDetail = lazy(() => import("./pages/TransactionDetail"));

// Loyalty Pages
const Membership = lazy(() => import("./pages/Membership"));
const MembershipDetail = lazy(() => import("./pages/MembershipDetail"));

// Clinical Pages
const DentalRecords = lazy(() => import("./pages/DentalRecords"));
const DentalRecordDetail = lazy(() => import("./pages/DentalRecordDetail"));

// Alerts Pages
const Notifications = lazy(() => import("./pages/Notifications"));
const NotificationDetail = lazy(() => import("./pages/NotificationDetail"));

// NEW CATEGORIZED PAGES BASED ON CRM.MD
const LoyaltyRewards = lazy(() => import("./pages/LoyaltyRewards"));
const CustomerActivities = lazy(() => import("./pages/CustomerActivities"));
const FeedbackReviews = lazy(() => import("./pages/FeedbackReviews"));
const Doctors = lazy(() => import("./pages/Doctors"));
const Treatments = lazy(() => import("./pages/Treatments"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));

const Landing = lazy(() => import("./pages/Landing"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

/* Auth */
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

/* Layout */
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

/* Protected Route */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* PUBLIC LANDING */}
        <Route path="/" element={<Landing />} />

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* MAIN */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* PATIENTS */}
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/add" element={<AddPatients />} />
          <Route path="/patients/add/preview" element={<AddPatientPreview />} />

          {/* SCHEDULE */}
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/schedule/:id" element={<ScheduleDetail />} />
          <Route path="/schedule/add" element={<AddSchedule />} />
          <Route path="/schedule/add/preview" element={<SchedulePreview />} />

          {/* TRANSACTIONS */}
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/:id" element={<TransactionDetail />} />

          {/* MEMBERSHIPS */}
          <Route path="/memberships" element={<Membership />} />
          <Route path="/memberships/:id" element={<MembershipDetail />} />

          {/* DENTAL RECORDS */}
          <Route path="/dental-records" element={<DentalRecords />} />
          <Route path="/dental-records/:id" element={<DentalRecordDetail />} />

          {/* NOTIFICATIONS */}
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetail />} />

          {/* NEW CRM AND OPERATIONAL PAGES */}
          <Route path="/loyalty-rewards" element={<LoyaltyRewards />} />
          <Route path="/customer-activities" element={<CustomerActivities />} />
          <Route path="/feedback-reviews" element={<FeedbackReviews />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />

          {/* ERROR */}
          <Route path="/400" element={<ErrorPage code="400" />} />
          <Route path="/401" element={<ErrorPage code="401" />} />
          <Route path="/403" element={<ErrorPage code="403" />} />

          {/* 404 */}
          <Route path="*" element={<ErrorPage code="404" />} />
        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;