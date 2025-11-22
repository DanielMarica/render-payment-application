import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
    return (
        <div>
            <NavBar />
            <main style={{ padding: '0 2rem' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
