import { Link } from "@remix-run/react";
import { useLogout, useUser } from "~/user"
import { Avatar, VerticalDivider } from "./common";
import { LinkButton, Button } from "./common";


export default function Navbar() {
  const user = useUser();
  const logout = useLogout();

  return (
    <nav className="sticky flex flex-row items-center h-16 justify-between border-b border-b-gray-600 px-3 md:px-40 xl:px-64 2xl:px-96">
      <div>
        <Link to="/" className="text-xl"><span className="text-teal-500">EZ</span>STUDY</Link>
      </div>
      <div>
      { 
        user
        ? <div className="flex flex-row items-center gap-3">
            <LinkButton to="/sets" className="flex flex-row items-center gap-3">
              <p>{user.username}</p>
              <Avatar src={user.avatarUrl} />
            </LinkButton>
            <VerticalDivider height={15} />
            <Button onClick={logout}>Logout</Button>
          </div>
        : <div className="flex flex-row items-center gap-3">
            <LinkButton to="/login">Login</LinkButton> 
            <span> or </span> 
            <LinkButton to="/register">Register</LinkButton>
          </div>
      } 
      </div>
    </nav>
  );
}
