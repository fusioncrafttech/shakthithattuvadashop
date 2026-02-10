import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-24 md:pb-12">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
