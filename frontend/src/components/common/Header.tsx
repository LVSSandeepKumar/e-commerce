import * as React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-8 my-4">
      <Link to="/">
        <h1 className="font-bold text-2xl">Collaborative Study Platform</h1>
      </Link>
      <div>
        <Link to="/signup">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
