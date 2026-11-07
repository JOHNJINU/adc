import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { PracticePage } from './pages/PracticePage';
import { MistakesPage } from './pages/MistakesPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { MockExamListPage } from './pages/MockExamListPage';
import LandingPage from './pages/LandingPage';

const MockExamPage = lazy(() => import('./pages/MockExamPage').then(m => ({ default: m.MockExamPage })));
const AdminQuestionListPage = lazy(() => import('./pages/admin/AdminQuestionListPage').then(m => ({ default: m.AdminQuestionListPage })));
const AdminQuestionFormPage = lazy(() => import('./pages/admin/AdminQuestionFormPage').then(m => ({ default: m.AdminQuestionFormPage })));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage').then(m => ({ default: m.AdminAnalyticsPage })));
const AdminMockExamListPage = lazy(() => import('./pages/admin/AdminMockExamListPage').then(m => ({ default: m.AdminMockExamListPage })));
const AdminMockExamFormPage = lazy(() => import('./pages/admin/AdminMockExamFormPage').then(m => ({ default: m.AdminMockExamFormPage })));
const AdminStudentListPage = lazy(() => import('./pages/admin/AdminStudentListPage').then(m => ({ default: m.AdminStudentListPage })));
const AdminStudentDetailPage = lazy(() => import('./pages/admin/AdminStudentDetailPage').then(m => ({ default: m.AdminStudentDetailPage })));

function Loading() {
  return <div style={{ padding: 24 }}>Loading…</div>;
}

function Layout() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0EEE6' }}>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

// Login/Register: logged-in users go back to where they were heading (or "/")
function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />

      {/* Public: anyone can see these */}
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        
      </Route>

      {/* Logged-in users only */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/mistakes" element={<MistakesPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/mock-exams" element={<MockExamListPage />} />
          <Route path="/mock-exams/:id" element={<MockExamPage />} />
        </Route>
      </Route>

      {/* Admin only */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<Layout />}>
          <Route path="/admin/questions" element={<AdminQuestionListPage />} />
          <Route path="/admin/questions/:id" element={<AdminQuestionFormPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
          <Route path="/admin/mock-exams" element={<AdminMockExamListPage />} />
          <Route path="/admin/mock-exams/:id" element={<AdminMockExamFormPage />} />
          <Route path="/admin/students" element={<AdminStudentListPage />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetailPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}