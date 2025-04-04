import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const links = [
    { name: 'Overview', path: '/dashboard/overview' },
    { name: 'My Predictions', path: '/dashboard/predictions' },
    { name: 'Token Wallet', path: '/dashboard/wallet' },
    
    
];

export default function Sidebar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout()
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-[#13242a] text-white h-full p-4">
            <h2 className="text-xl font-bold mb-6">ASSERT</h2>
            <nav className="flex flex-col space-y-4">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded hover:bg-accent/80 ${isActive ? 'bg-accent' : ''
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}

                <button
                    onClick={handleLogout}
                    className="text-left px-4 py-2 rounded hover:bg-accent text-white mt-4"
                >
                    Logout
                </button>
            </nav>
        </aside>
    );
}
