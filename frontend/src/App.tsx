import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import EmployeeListPage from './features/Employees/EmployeesListPage';
import RegisterPage from './features/auth/RegisterPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/employees" element={<EmployeeListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;