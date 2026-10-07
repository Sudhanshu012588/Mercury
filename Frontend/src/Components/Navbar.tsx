import { Link, NavLink } from "react-router-dom";
import UserMenu from "./UserMenu";
const Navbar = () => {
  return (
    <header className="w-full border-b border-white/10 bg-slate-950">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-500">
          Mercury
        </Link>

        {/* Navigation Links */}
        <ul className="flex items-center gap-6 text-gray-300">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-white transition ${
                isActive ? "text-white font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/notebooks"
            className={({ isActive }) =>
              `hover:text-white transition ${
                isActive ? "text-white font-semibold" : ""
              }`
            }
          >
            Notebooks
          </NavLink>

          <NavLink
            to="/navigation"
            className={({ isActive }) =>
              `hover:text-white transition ${
                isActive ? "text-white font-semibold" : ""
              }`
            }
          >
            Navigation
          </NavLink>
        </ul>

        {/* Right Side Actions */}
       <div>
  <UserMenu />
</div>


      </nav>
    </header>
  );
};

export default Navbar;
