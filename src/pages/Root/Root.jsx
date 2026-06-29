import { Outlet } from 'react-router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Root = () => {
  return (
    <div className="pg-root-bg flex flex-col min-h-screen">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Root;