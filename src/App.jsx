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

// Master Account Setting
const Profiles = lazy(() => import("./pages/MasterUser/MasterAccount")); 
const ProfileSetting = lazy(() => import("./pages/MasterUser/MasterAccount/profile_setting"));
const PasswordSetting = lazy(() => import("./pages/MasterUser/MasterAccount/password_setting"));

// Master Sales Pages
const SalesArmy = lazy(() => import("./pages/MasterSales/SalesArmy"));
const DetailArmy = lazy(() => import("./pages/MasterSales/SalesArmy/detail"));
const ReviewArmy = lazy(() => import("./pages/MasterSales/SalesArmy/review"));
const ArmyContents = lazy(() => import("./pages/MasterSales/SalesArmy/ArmyContent"));

const SalesInternal = lazy(() => import("./pages/MasterSales/SalesInternal"));

// Master Divisi
const Dealers = lazy(() => import("./pages/MasterDivisi/MasterDealer"));
const Sites = lazy(() => import("./pages/MasterDivisi/MasterSite"));
const CreateSite = lazy(() => import("./pages/MasterDivisi/MasterSite/create"));
const UpdateSite = lazy(() => import("./pages/MasterDivisi/MasterSite/update"));

// Master User
const Users = lazy(() => import("./pages/MasterUser/MasterAccountUser"));
const DetailUser = lazy(() => import("./pages/MasterUser/MasterAccountUser/detail"));
const Permissions = lazy(() => import("./pages/MasterUser/MasterPermission"));
const CreatePermission = lazy(() => import('./pages/MasterUser/MasterPermission/create'));
const UpdatePermission = lazy(() => import('./pages/MasterUser/MasterPermission/update'));

// Master Data
const Products = lazy(() => import("./pages/MasterData/Product"));
const CreateProduct = lazy(() => import("./pages/MasterData/Product/create"));
const DetailProducts = lazy(() => import("./pages/MasterData/Product/detail"));
const UpdateProduct = lazy(() => import("./pages/MasterData/Product/update"));
const Bundles = lazy(() => import("./pages/MasterData/Bundles"));
const CreateBundle = lazy(() => import("./pages/MasterData/Bundles/create"));
const UpdateBundle = lazy(() => import("./pages/MasterData/Bundles/update"));
const DetailBundles = lazy(() => import("./pages/MasterData/Bundles/detail"));
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
              <Route path="army/detail/:uid" element={<DetailArmy />} />
              <Route path="army/review/:uid" element={<ReviewArmy />} />
              <Route path="contents/army" element={<ArmyContents />} />

              {/* Route Sales Internal */}
              <Route path="salesInternal" element={<SalesInternal />} />

              {/* Route Divisi */}
              <Route path="dealers" element={<Dealers />} />
              <Route path="sites" element={<Sites />} />
              <Route path="site/create" element={ <Suspense fallback={<Loading />}> <CreateSiteProtect /> </Suspense> } />
              <Route path="site/update/:uid" element={ <Suspense fallback={<Loading />}> <UpdateSiteProtect /> </Suspense> } />
              
              {/* Route Master Data */}
              <Route path="products" element={<Products />} />
              <Route path="product/create" element={<CreateProduct />} />
              <Route path="product/detail/:uid" element={<DetailProducts />} />
              <Route path="product/update/:uid" element={<UpdateProduct />} />
              
              <Route path="bundles" element={<Bundles />} />
              <Route path="bundles/create" element={<CreateBundle />} />
              <Route path="bundles/detail/:uid" element={<DetailBundles />} />
              <Route path="bundles/update/:uid" element={<UpdateBundle />} />
              <Route path="categories" element={<Categories />} />
              <Route path="cars" element={<Cars />} />
              <Route path="cars/update/:uid" element={<UpdateCars />} />

              {/* Route User */}
              <Route path="profile" element={<Profiles />} />
              <Route path="profile/setting" element={<ProfileSetting />} />
              <Route path="profile/setting/password" element={<PasswordSetting />} />
              <Route path="users" element={ <Suspense fallback={<Loading />}> <UserProtect /> </Suspense> } />
              <Route path="users/detail/:uid" element={<DetailUser />} />

              {/* Route Permission */}
              <Route path="permissions" element={<Permissions />} />
              <Route path="permission/create" element={<CreatePermission />} />
              <Route path="permission/update/:uid" element={<UpdatePermission />} />
              
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
