import { Outlet, useLocation } from "react-router";
import ServicesShowcase from "../components/ServicesShowcase";

function Services() {
  const location = useLocation();
  const isServicesHome = location.pathname === "/services";

  return <div>{isServicesHome ? <ServicesShowcase /> : <Outlet />}</div>;
}

export default Services;
