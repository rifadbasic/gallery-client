import React from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayoute() {
  return (
    <>

    <Navbar />

    <div>
        <Outlet />
    </div>
    <Footer />
      
    </>
  );
}
