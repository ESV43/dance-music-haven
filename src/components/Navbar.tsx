
import { Link } from "react-router-dom";
import { UserProfile } from "@/components/auth/UserProfile";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Room Booking</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              My Bookings
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
