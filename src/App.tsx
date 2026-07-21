import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Fabrics from './pages/Fabrics';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useSiteSettings } from './lib/hooks';

type Page = 'home' | 'products' | 'fabrics' | 'admin';

const ADMIN_FLAG = 'pal_admin_authed';

function readHash(): Page {
  return window.location.hash.replace(/^#/, '') === 'admin' ? 'admin' : 'home';
}

export default function App() {
  const { settings } = useSiteSettings();
  const [page, setPage] = useState<Page>(readHash());
  const [adminAuthed, setAdminAuthed] = useState(false);

  useEffect(() => {
    try {
      setAdminAuthed(sessionStorage.getItem(ADMIN_FLAG) === '1');
    } catch {
      // sessionStorage may be unavailable; ignore
    }
    const onHash = () => setPage(readHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (p: Page) => {
    if (p === 'admin') {
      window.location.hash = 'admin';
    } else {
      if (window.location.hash) history.replaceState(null, '', window.location.pathname);
      setPage(p);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = () => {
    try {
      sessionStorage.setItem(ADMIN_FLAG, '1');
    } catch {
      // ignore
    }
    setAdminAuthed(true);
  };

  const logoutAdmin = () => {
    try {
      sessionStorage.removeItem(ADMIN_FLAG);
    } catch {
      // ignore
    }
    setAdminAuthed(false);
    navigate('home');
  };

  if (page === 'admin') {
    return adminAuthed ? (
      <AdminDashboard onLogout={logoutAdmin} onExit={() => navigate('home')} />
    ) : (
      <AdminLogin onSuccess={loginAdmin} onCancel={() => navigate('home')} />
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} page={page} onNavigate={navigate} />
      <main className="flex-1">
        {page === 'home' && <Home settings={settings} onNavigate={navigate} />}
        {page === 'products' && <Products />}
        {page === 'fabrics' && <Fabrics />}
      </main>
      <Footer settings={settings} onNavigate={navigate} />
    </div>
  );
}
