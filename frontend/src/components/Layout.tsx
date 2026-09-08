import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/inspection', label: 'Inspection Module' },
  { to: '/previous-observations', label: 'Ship Previous Observations' },
  { to: '/fleet-observations', label: 'Fleet Observation Tracking' },
  { to: '/crew', label: 'Crew Competency' },
  { to: '/individual-assessment', label: 'Individual Assessment' },
  { to: '/reports', label: 'Reports' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">SIRE 2.0 Virtual Vetting Inspector</h1>
            <p className="text-xs text-slate-300">MT Ocean Voyager · Zero-Observation Vetting Preparation</p>
          </div>
        </div>
        <nav className="bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'border-sky-400 text-white'
                      : 'border-transparent text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-4">
        Based on OCIMF SIRE 2.0 &amp; INTERTANKO Seafarers&apos; Practical Guide to SIRE 2.0 Inspections
      </footer>
    </div>
  );
}
