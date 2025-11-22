import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import List from './pages/List';
import Add from './pages/Add';
import './App.css';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: 'list',
        element: <List />,
      },
      {
        path: 'add',
        element: <Add />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
