import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AbilityProvider, useAbility } from "./API/PermissionContext";
import { createMongoAbility } from "@casl/ability";
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";

const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/auth/login"));
const Error = lazy(() => import("./pages/404"));
const Error403 = lazy(() => import("./pages/403"));
const ComingSoonPage = lazy(() => import("./pages/utility/coming-soon"));
const UnderConstructionPage = lazy(() => import("./pages/utility/under-construction"));

// Master Sales Pages
const SalesArmy = lazy(() => import("./pages/MasterSales/SalesArmy"));
const DetailArmy = lazy(() => import("./pages/MasterSales/SalesArmy/detail"));
const ReviewArmy = lazy(() => import("./pages/MasterSales/SalesArmy/review"));
const SalesInternal = lazy(() => import("./pages/MasterSales/SalesInternal"));

// Master Divisi
const Dealers = lazy(() => import("./pages/MasterDivisi/MasterDealer"));
const Sites = lazy(() => import("./pages/MasterDivisi/MasterSite"));
const CreateSite = lazy(() => import("./pages/MasterDivisi/MasterSite/create"));
const UpdateSite = lazy(() => import("./pages/MasterDivisi/MasterSite/update"));

// Master User
const Users = lazy(() => import("./pages/MasterUser/MasterAccountUser"));
const DetailUser = lazy(() => import("./pages/MasterUser/MasterAccountUser/detail"));

// Master Data
const Categories = lazy(() => import("./pages/MasterData/Category"));
const Cars = lazy(() => import("./pages/MasterData/Cars"));
const UpdateCars = lazy(() => import("./pages/MasterData/Cars/update"));

function App() {
  const ability = createMongoAbility();
    return (
      <AbilityProvider ability={ability}>
        <main className="App relative">
          <Routes>
            <Route path="/" element={ <Suspense fallback={<Loading />}> <Login /> </Suspense>} />
            <Route path="/*" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />

              {/* Route Sales Army */}
              <Route path="army" element={<SalesArmy />} />
              <Route path="detailArmy/:uid" element={<DetailArmy />} />
              <Route path="review/:uid" element={<ReviewArmy />} />

              {/* Route Sales Internal */}
              <Route path="salesInternal" element={<SalesInternal />} />

              {/* Route Divisi */}
              <Route path="dealer" element={<Dealers />} />
              <Route path="cabang" element={<Sites />} />
              <Route path="tambahCabang" element={ <Suspense fallback={<Loading />}> <CreateSiteProtect /> </Suspense> } />
              <Route path="ubahCabang/:uid" element={ <Suspense fallback={<Loading />}> <UpdateSiteProtect /> </Suspense> } />
              
              {/* Route Master Data */}
              <Route path="category" element={<Categories />} />
              <Route path="cars" element={<Cars />} />
              <Route path="ubahMobil/:uid" element={<UpdateCars />} />

              {/* Route User */}
              <Route path="pengguna" element={ <Suspense fallback={<Loading />}> <UserProtect /> </Suspense> } />
              <Route path="detailPengguna/:uid" element={<DetailUser />} />
              
              {/* Route Error */}
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="#" element={<Navigate to="/403" />} />
            </Route>

            <Route path="/404" element={ <Suspense fallback={<Loading />}> <Error /> </Suspense> } />
            <Route path="/403" element={ <Suspense fallback={<Loading />}> <Error403 /> </Suspense> } />
            <Route path="/coming-soon" element={ <Suspense fallback={<Loading />}> <ComingSoonPage /> </Suspense> } />
            <Route path="/under-construction" element={ <Suspense fallback={<Loading />}> <UnderConstructionPage /> </Suspense> } />
          </Routes>
        </main>
      </AbilityProvider>
    );
  }

  function ProtectedComponent({ action, permission, component }) {
  const ability = useAbility();
  const isSpv = localStorage.getItem("is_spv") === "true";
    if (isSpv || ability.can(action, permission)) {
      return component;
    }
    return <Navigate to="/403" />;
  }

  function UserProtect() {
    return (
      <ProtectedComponent
        action="read"
        permission="Pengguna"
        component={<Users />}
      />
    );
  }
  function CreateSiteProtect() {
    return (
      <ProtectedComponent
        action="read"
        permission="Tambah Cabang"
        component={<CreateSite />}
      />
    );
  }
  function UpdateSiteProtect() {
    return (
      <ProtectedComponent
        action="read"
        permission="Ubah Cabang"
        component={<UpdateSite />}
      />
    );
  }

export default App;
