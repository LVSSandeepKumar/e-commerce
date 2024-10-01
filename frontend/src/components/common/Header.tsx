import * as React from "react";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-8 my-4">
      <h1 className="font-bold text-2xl">Collaborative Study Platform</h1>
      <div>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};

export default Header;
