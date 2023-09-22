/** @format */

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { UserProvider } from "../contexts/UserNameContext";

const Layout = () => {
  return (
    <main className="App">
      <UserProvider>
        <Header />
        <Outlet />
        <Footer />
      </UserProvider>
    </main>
  );
};

export default Layout;
