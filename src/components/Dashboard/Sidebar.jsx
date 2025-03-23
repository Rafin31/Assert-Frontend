import { NavLink } from 'react-router-dom';

const links = [
    { name: 'Overview', path: '/dashboard/overview' },
    { name: 'My Predictions', path: '/dashboard/predictions' },
    { name: 'Token Wallet', path: '/dashboard/wallet' },
    { name: 'Create Issues', path: '/dashboard/create' },
    { name: 'Logout', path: '/logout' },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-[#13242a] text-white h-full p-4">
            <h2 className="text-xl font-bold mb-6">ASSERT</h2>
            <nav className="flex flex-col space-y-4">
                {links.map((link) => (
                    <NavLink
                        key={link.name}
                        to={link.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded hover:bg-accent/80 ${isActive ? 'bg-primary-content text-accent' : ''
                            }`
                        }
                    >
                        {link.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
