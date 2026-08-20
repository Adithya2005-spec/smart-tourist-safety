import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SafetyProvider } from "./contexts/SafetyContext";
import AuthorityAnalytics from "./pages/AuthorityAnalytics";
import AuthorityAudit from "./pages/AuthorityAudit";
import AuthorityCommand from "./pages/AuthorityCommand";
import AuthorityIncidents from "./pages/AuthorityIncidents";
import AuthorityRisk from "./pages/AuthorityRisk";
import AuthorityTourists from "./pages/AuthorityTourists";
import AdminOversight from "./pages/AdminOversight";
import RoleLanding from "./pages/RoleLanding";
import TouristContacts from "./pages/TouristContacts";
import TouristGuardian from "./pages/TouristGuardian";
import TouristHome from "./pages/TouristHome";
import TouristIdentity from "./pages/TouristIdentity";
import TouristIncidents from "./pages/TouristIncidents";
import TouristLocation from "./pages/TouristLocation";
import TouristMap from "./pages/TouristMap";
import TouristSettings from "./pages/TouristSettings";
import TouristSOS from "./pages/TouristSOS";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PanIndiaExplorer from "./pages/PanIndiaExplorer";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={RoleLanding} />
      <Route path={"/signin"} component={SignIn} />
      <Route path={"/login"} component={SignIn} />
      <Route path={"/signup"} component={SignUp} />
      <Route path={"/register"} component={SignUp} />
      <Route path={"/pan-india"} component={PanIndiaExplorer} />
      <Route path={"/states"} component={PanIndiaExplorer} />
      <Route path={"/tourist"} component={TouristHome} />
      <Route path={"/tourist/map"} component={TouristMap} />
      <Route path={"/tourist/sos"} component={TouristSOS} />
      <Route path={"/tourist/incidents"} component={TouristIncidents} />
      <Route path={"/tourist/identity"} component={TouristIdentity} />
      <Route path={"/tourist/guardian"} component={TouristGuardian} />
      <Route path={"/tourist/contacts"} component={TouristContacts} />
      <Route path={"/tourist/location"} component={TouristLocation} />
      <Route path={"/tourist/settings"} component={TouristSettings} />
      <Route path={"/authority"} component={AuthorityCommand} />
      <Route path={"/authority/incidents"} component={AuthorityIncidents} />
      <Route path={"/authority/tourists"} component={AuthorityTourists} />
      <Route path={"/authority/risk"} component={AuthorityRisk} />
      <Route path={"/authority/analytics"} component={AuthorityAnalytics} />
      <Route path={"/authority/audit"} component={AuthorityAudit} />
      <Route path={"/admin"} component={AdminOversight} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <TooltipProvider>
          <Toaster />
          <SafetyProvider>
            <Router />
          </SafetyProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
