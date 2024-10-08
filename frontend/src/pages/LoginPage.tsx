import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="px-24 py-24 my-24 mx-24 rounded-md hover:shadow-lg">
      <h2 className="text-3xl font-bold">
        Login to Collaborative Study Platform
      </h2>
      <p className="mt-4">Jump into your world where studies are fun.</p>
      <div className="py-2 flex gap-2 flex-col">
        <label className="font-semibold">Email</label>
        <Input className="w-full" placeholder="Example123@mail.com" />
      </div>
      <div className=" py-2 flex gap-2 flex-col">
        <label className="font-semibold">Password</label>
        <Input className="w-full" placeholder="******" />
      </div>
      <Button className="mt-2 w-full">Login</Button>
      <div className="flex gap-4 items-center mt-4">
        <p>New to our platform ?</p>
        <Link to="/signup" className="font-semibold">
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
