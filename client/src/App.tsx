import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import DripDetail from "./pages/DripDetail";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminBookingDetail from "./pages/admin/BookingDetail";
import AdminServices from "./pages/admin/Services";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";
import AdminLogin from "./pages/admin/Login";

/** Scrolls to the top of the page on every route change */
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/services" component={Services} />
        <Route path="/services/:slug" component={DripDetail} />
        <Route path="/book" component={Booking} />
        <Route path="/booking" component={Booking} />
        <Route path="/contact" component={Contact} />

        {/* Admin routes */}
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/bookings" component={AdminBookings} />
        <Route path="/admin/bookings/:id" component={AdminBookingDetail} />
        <Route path="/admin/services" component={AdminServices} />
        <Route path="/admin/testimonials" component={AdminTestimonials} />
        <Route path="/admin/messages" component={AdminMessages} />
        <Route path="/admin/settings" component={AdminSettings} />

        {/* Fallback */}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
