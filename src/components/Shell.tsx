import { NavLink, Outlet } from 'react-router-dom'
import './Shell.css'

const demos = [
  { path: '/virtual-email-list', label: 'Virtual Email List' },
  { path: '/product-card-grid', label: 'Product Card Grid' },
  { path: '/smart-truncation', label: 'Smart Truncation' },
  { path: '/text-fitting', label: 'Text Fitting' },
  { path: '/typography-lab', label: 'Typography Lab' },
]

export function Shell() {
  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="shell__logo">
          <h1>Pretext POC</h1>
          <p>DOM-free text layout demos</p>
        </div>
        <nav className="shell__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `shell__nav-item${isActive ? ' shell__nav-item--active' : ''}`
            }
          >
            Home
          </NavLink>
          {demos.map((demo, i) => (
            <NavLink
              key={demo.path}
              to={demo.path}
              className={({ isActive }) =>
                `shell__nav-item${isActive ? ' shell__nav-item--active' : ''}`
              }
            >
              <span className="shell__nav-number">{i + 1}</span>
              {demo.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="shell__content">
        <Outlet />
      </main>
    </div>
  )
}
