import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
    return (
        <div>
            <NavBar />
            <main className="container mx-auto pt-32 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
