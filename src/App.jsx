import axios from "axios";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { EnumeratorForm } from "./pages/enumerator";

import {
  Enumerators,
  Tracker,
  FormResponses,
  Dashboard,
  Profile,
  MasterList,
} from "./pages/team-lead";
import {
  AdminEnumerators,
  AdminTracker,
  AdminFormResponses,
  AdminDashboard,
  AdminProfile,
  AdminMasterList,
  TeamLeads,
  AddTeamLead,
  AdminNewRoute,
  TeamLeadProfile,
  History,
  AdminConfiguration,
} from "./pages/admin";

import TeamLead from "./components/layout/TeamLead";
import AddEnumerator from "./pages/team-lead/AddEnumerator";
import Login from "./pages/Login";
import NewRoute from "./pages/team-lead/NewRoute";
import { EnumeratorFormProvider, useApp, useAuth } from "./context";
import { base_url, base_url_local, base_url_local_2 } from "./lib/paths";
import Admin from "./components/layout/Admin";
import secureLocalStorage from "react-secure-storage";
import { LoginTest } from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

function App() {
  const { user, isLoggedIn } = useAuth();

  const clearLocalStorage = () => {
    localStorage.removeItem("oius");
  };

  const interval = 3 * 24 * 60 * 60 * 1000;
  setInterval(clearLocalStorage, interval);

  // axios configs
  axios.defaults.baseURL = base_url;
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.common["Authorization"] = `Bearer ${user?.token}`;

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error?.response?.status === 401) {
        secureLocalStorage.removeItem("oius");
        window.location.href = "/";
      }
      return Promise.reject(error);
    }
  );

  const identifyRoute = (user) => {
    if (user.role.toLowerCase() === "enumerator") {
      return <Navigate replace to={"/form"} />;
    }
    if (user.role === "team_lead") {
      return <Navigate replace to={"/home"} />;
    }

    if (user.role === "admin" || user.role === "super_admin") {
      return <Navigate replace to={"/admin/home"} />;
    }
  };

  // const adminRoleCheck =
  //   isLoggedIn &&
  //   user &&
  //   (user.role === "admin" || user.role === "super_admin"  || user.role === "SuperAdmin");

  const adminRoleCheck =
    isLoggedIn &&
    user &&
    (user.role === "admin" || user.role === "super_admin"  || user.role === "SuperAdmin");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn && user ? identifyRoute(user) : <Login />}
          />
          <Route
            path="/login_test"
            element={isLoggedIn && user ? identifyRoute(user) : <LoginTest />}
          />
          {/* enumerator routes */}
          <Route
            path="/form"
            element={
              isLoggedIn && user && user.role.toLowerCase() === "enumerator" ? (
                <EnumeratorFormProvider>
                  <EnumeratorForm />
                </EnumeratorFormProvider>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          {/* team lead routes */}
          <Route
            path="/home"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <Dashboard />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/enumerators"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <Enumerators />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/responses"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <FormResponses />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/tracker"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <Tracker />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/add"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <AddEnumerator />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn && user && user.role === "team_lead" ? (
                <TeamLead>
                  <Profile />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/master"
            element={
              user && user.role === "team_lead" ? (
                <TeamLead>
                  <MasterList />
                </TeamLead>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          {/* admin routes */}
          <Route
            path="/admin/home"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminDashboard />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/team_leads"
            element={
              adminRoleCheck ? (
                <Admin>
                  <TeamLeads />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/team_leads/:id"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminEnumerators />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/responses"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminFormResponses />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          <Route
            path="admin/tracker"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminTracker />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="admin/history"
            element={
              adminRoleCheck ? (
                <Admin>
                  <History />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/add"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AddTeamLead />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/profile"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminProfile />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          <Route
            path="/admin/profile/:id"
            element={
              adminRoleCheck ? (
                <Admin>
                  <TeamLeadProfile />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          <Route
            path="/admin/master"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminMasterList />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />
          <Route
            path="/admin/new-lga"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminNewRoute />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          <Route
            path="/admin/configuration"
            element={
              adminRoleCheck ? (
                <Admin>
                  <AdminConfiguration />
                </Admin>
              ) : (
                <Navigate replace to={"/"} />
              )
            }
          />

          <Route path="*" element={<p>This route doesn't exist</p>} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
