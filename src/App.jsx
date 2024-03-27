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
  AdminNewProduct,
  AdminNewCategory,
  AdminViewProducts,
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
import {
  SuperAdminAddTeamLead,
  SuperAdminConfiguration,
  SuperAdminDashboard,
  SuperAdminEnumerators,
  SuperAdminFormResponses,
  SuperAdminHistory,
  SuperAdminMasterList,
  SuperAdminNewCategory,
  SuperAdminNewCountry,
  SuperAdminNewProduct,
  SuperAdminNewRoute,
  SuperAdminNewSubAdmin,
  SuperAdminProfile,
  SuperAdminSubAdminTeamLeads,
  SuperAdminSubAdmins,
  SuperAdminTeamLeadProfile,
  SuperAdminTracker,
  SuperAdminViewProducts,
} from "./pages/super-admin";
import SuperAdmin from "./components/layout/SuperAdmin";
import { ProtectedRoute } from "./components/layout";
import { ToastContainer } from "react-toastify";

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
    if (user.role === "TeamLead") {
      return <Navigate replace to={"/home"} />;
    }

    if (user.role === "SubAdmin") {
      return <Navigate replace to={"/admin/home"} />;
    }

    if (user.role === "SuperAdmin") {
      return <Navigate replace to={"/super_admin/home"} />;
    }
  };

  // const adminRoleCheck =
  //   isLoggedIn &&
  //   user &&
  //   (user.role === "admin" || user.role === "super_admin"  || user.role === "SuperAdmin");

  const adminRoleCheck = isLoggedIn && user && user.role === "SubAdmin";

  const superAdminRoleCheck = isLoggedIn && user && user.role === "SuperAdmin";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <ToastContainer />
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
              <ProtectedRoute
                requiredRole="TeamLead"
                component={
                  <TeamLead>
                    <Dashboard />
                  </TeamLead>
                }
              />
            }
          />
          <Route
            path="/enumerators"
            element={
              isLoggedIn && user && user.role === "TeamLead" ? (
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
              isLoggedIn && user && user.role === "TeamLead" ? (
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
              isLoggedIn && user && user.role === "TeamLead" ? (
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
              isLoggedIn && user && user.role === "TeamLead" ? (
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
              isLoggedIn && user && user.role === "TeamLead" ? (
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
              user && user.role === "TeamLead" ? (
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
            path="/admin/team_leads/:teamLeadId"
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
              <ProtectedRoute
                requiredRole="SubAdmin"
                component={
                  <Admin>
                    <AdminConfiguration />
                  </Admin>
                }
              />
            }
          />
          <Route
            path="admin/configuration/category_products/:categoryId"
            element={
              <ProtectedRoute
                requiredRole="SubAdmin"
                component={
                  <Admin>
                    <AdminViewProducts />
                  </Admin>
                }
              />
            }
          />

          <Route
            path="/admin/configuration/categories"
            element={
              <ProtectedRoute
                requiredRole="SubAdmin"
                component={
                  <Admin>
                    <AdminNewCategory />
                  </Admin>
                }
              />
            }
          />

          <Route
            path="/admin/configuration/products"
            element={
              <ProtectedRoute
                requiredRole="SubAdmin"
                component={
                  <Admin>
                    <AdminNewProduct />
                  </Admin>
                }
              />
            }
          />

          {/* super admin configuration */}
          <Route
            path="/super_admin/admins/:countryId/add_team_lead"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminAddTeamLead />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/configuration"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminConfiguration />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/configuration/products"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminNewProduct />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/configuration/categories"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminNewCategory />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="super_admin/configuration/category_products/:categoryId"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminViewProducts />
                  </SuperAdmin>
                }
              />
            }
          />

          {/* super admin home */}
          <Route
            path="/super_admin/home"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminDashboard />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/responses"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminFormResponses />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/master"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminMasterList />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/new_route"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminNewRoute />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/profile"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminProfile />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/history"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminHistory />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/admins"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminSubAdmins />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/admins/country_team_leads/:countryId"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminSubAdminTeamLeads />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/admins/add"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminNewSubAdmin />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/admins/assign_country"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminNewCountry />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/:countryId/team_lead_profile"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminTeamLeadProfile />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/admins/team_lead_enumerators/:teamLeadId"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminEnumerators />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route
            path="/super_admin/tracker"
            element={
              <ProtectedRoute
                requiredRole="SuperAdmin"
                component={
                  <SuperAdmin>
                    <SuperAdminTracker />
                  </SuperAdmin>
                }
              />
            }
          />

          <Route path="*" element={<p>This route doesn't exist</p>} />
        </Routes>
      </div>
    </QueryClientProvider>
  );
}

export default App;
