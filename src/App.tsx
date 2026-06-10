import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./context/auth.store";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import UsersPage from "./pages/users/UsersPage";
import StudentsPage from "./pages/students/StudentsPage";
import StudentDetailPage from "./pages/students/StudentDetailPage";
import RequestPage from "./pages/requests/RequestPage";
import RequestDetailPage from "./pages/requests/RequestDetailPage";
import NotFoundPage from "./pages/NotFound";
import { Toaster } from "@/components/ui/sonner";
import DefaultLayout from "@/components/layouts/AdminLayout";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  //if (!isAuthenticated) {
  //return <Navigate to="/login" replace />;
  //}

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* Raíz: si está logueado va al dashboard, si no al login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Login: si ya está logueado, no tiene sentido mostrarlo */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />

        {/* Bloque protegido con DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/usuarios" element={<UsersPage />} />
          <Route path="/dashboard/estudiantes" element={<StudentsPage />} />
          <Route
            path="/dashboard/estudiantes/:studentId"
            element={<StudentDetailPage />}
          />
          <Route path="/dashboard/solicitudes" element={<RequestPage />} />
          <Route path="/dashboard/solicitudes/:requestId" element={<RequestDetailPage />} />
        </Route>

        {/* 404 para cualquier otra ruta */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
