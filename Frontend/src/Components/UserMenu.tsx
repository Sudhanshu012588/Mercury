import { SignedIn, SignedOut, SignInButton, useUser, useClerk } from "@clerk/clerk-react";

const UserMenu = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="relative">
      <SignedOut>
        <SignInButton>
          <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium">
            Login
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="group cursor-pointer flex items-center gap-2 select-none relative">
          {/* Avatar */}
          <img
            src={user?.imageUrl}
            className="w-10 h-10 rounded-full border border-white/20"
          />

          {/* Dropdown */}
          <div
            className="
              absolute right-0 top-12 w-72
              bg-slate-900 border border-white/10 rounded-xl shadow-2xl
              p-4
              opacity-0 scale-95 translate-y-2
              group-hover:opacity-100
              group-hover:scale-100
              group-hover:translate-y-0
              pointer-events-none
              group-hover:pointer-events-auto
              transition-all duration-500 ease-out
            "
          >
            {/* User Info */}
            <div className="flex items-center gap-3">
              <img
                src={user?.imageUrl}
                className="w-12 h-12 rounded-full border border-white/20"
              />
              <div>
                <p className="text-white font-semibold">{user?.fullName}</p>
                <p className="text-gray-400 text-sm">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="mt-4 border-t border-white/10"></div>

            {/* Logout Button */}
            <button
              onClick={() => signOut()}
              className="mt-4 w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 transition font-semibold text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </SignedIn>
    </div>
  );
};

export default UserMenu;
