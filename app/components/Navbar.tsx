import type { RemixLinkProps } from "@remix-run/react/dist/components";
import type { ButtonHTMLAttributes } from "react";
import { Link } from "@remix-run/react";
import { useLogout, useUser } from "~/user"
import { Avatar, VerticalDivider } from "./common";

function NavLink({ className, children, ...rest }: RemixLinkProps) {
  return <Link className={"text-teal-500 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-300/30 px-3 py-1 rounded-md " + className} {...rest} >
    {children}
  </Link>
}

function NavButton({ className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={"text-teal-500 hover:text-teal-300 bg-teal-500/10 hover:bg-teal-300/30 px-3 py-1 rounded-md " + className} {...rest} />
}

export default function Navbar() {
  const user = useUser();
  const logout = useLogout();

  return (
    <nav className="sticky flex flex-row items-center h-16 justify-between border-b border-b-gray-600 px-3 lg:px-96">
      <div>
        <Link to="/" className="text-xl"><span className="text-teal-500">EZ</span>STUDY</Link>
      </div>
      <div>
      { 
        user
        ? <div className="flex flex-row items-center gap-3">
            <NavLink to="/sets" className="flex flex-row items-center gap-3">
              <p>{user.username}</p>
              <Avatar src={user.avatarUrl} />
            </NavLink>
            <VerticalDivider height={15} />
            <NavButton onClick={logout}>Logout</NavButton>
          </div>
        : <div className="flex flex-row items-center gap-3">
            <NavLink to="/login">Login</NavLink> 
            <span> or </span> 
            <NavLink to="/register">Register</NavLink>
          </div>
      } 
      </div>
    </nav>
  );
}
