import * as React from "react";

import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/common/Header";

function App() {
  return (
    <>
      <div className="max-w-5xl mx-auto flex flex-col justify-center bg-gradient-to-br from-emerald-300 to-sky-400 shadow-lg">
        <Header />
        <hr className="border-t-2 border-gray-950"/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
