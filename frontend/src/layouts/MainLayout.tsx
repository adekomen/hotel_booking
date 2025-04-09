import GlobalNavbar from "../components/global-navbar/GlobalNavbar";
import GlobalFooter from "../components/global-footer/GlobalFooter";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <GlobalNavbar />
      <main>
        <Outlet />
      </main>
      <GlobalFooter />
    </>
  );
}

export default MainLayout;
