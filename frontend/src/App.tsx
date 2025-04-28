import './App.css'
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminPage } from './pages/AdminPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <> 
      <Routes>
        <Route path="admin/*" element={<AdminDashboard />} />
        <Route path="/" element={<Layout />}>
          <Route path="api/" element={<LoginPage/>}/>
          <Route index element={<Home />} />
          <Route path="storage/users/" element={<AdminPage />}/>
          <Route path="storage/users/:userId/" element={<UserDetailPage />}/>
          <Route path="storage/:userId/" element={<UserDetailPage />} />
          <Route path="register/" element={<RegisterPage />}/>
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

const AdminDashboard = () => (
  <iframe src="/admin/" title="Admin Dashboard" style={{ width: '100%', height: '100vh', border: 'none' }} />
);

export default App;
