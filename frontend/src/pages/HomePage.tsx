import * as React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import StudyImage from "../assets/Study.jpg";
import { HomeScreenCardItems } from "@/constans";

const HomePage = () => {
  return (
    <div className="px-1 py-10 my-10 mx-10 rounded-md">
      <div className="flex justify-between">
        <div className="flex flex-col gap-4 py-10 animate-bounce transition-all repeat-1">
          <h1 className="text-3xl font-bold font-serif">
            Unlock your learning potential together
          </h1>
          <p className="max-w-xl">
            Join a community of learners collaborating to share notes, study
            materials, and knowledge. Empower your academic journey with
            interactive resources and peer-driven support.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button>Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Register</Button>
            </Link>
          </div>
        </div>

        <img
          src={StudyImage}
          className="size-72 hover:scale-105 rounded-lg transition-all animate-bounce repeat-1"
        />
      </div>

      <div className="mt-12">
        <h1 className="text-3xl font-bold text-center font-serif">
          Why join us ?
        </h1>
        <div className="grid grid-cols-3 m-8 gap-8">
          {HomeScreenCardItems.map((item) => (
            <div
              className="hover:shadow-lg p-6 rounded-lg hover:scale-105"
              key={item.title}
            >
              <h1 className="text-xl font-semibold">{item.title}</h1>
              <p className="mt-4">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
