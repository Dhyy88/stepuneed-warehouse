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
const Profiles = lazy(() => import("./pages/MasterUser")); 
const ProfileSetting = lazy(() => import("./pages/MasterUser/profile_setting"));
const PasswordSetting = lazy(() => import("./pages/MasterUser/password_setting"));

// Master StockOpname
const PurchaseOrderDetail = lazy(() => import("./pages/MasterPO/index_PO"));
const ReceivePO = lazy(() => import("./pages/MasterPO"));
const DetailPONumber = lazy(() => import("./pages/MasterPO/detail"));
const Stock = lazy(() => import("./pages/MasterStock/"));
const StockOpname = lazy(() => import("./pages/MasterStock/StockOpname"));
const CreateStockOpname = lazy(() => import("./pages/MasterStock/StockOpname/create"));
const DetailStockOpname = lazy(() => import("./pages/MasterStock/StockOpname/detail"));
const UpdateNoteStockOpname = lazy(() => import("./pages/MasterStock/StockOpname/update"));
const ManualStock = lazy(() => import("./pages/MasterStock/ManualStock"));
const DetailManualStock = lazy(() => import("./pages/MasterStock/ManualStock/detail"));
const ReceiveManualStock = lazy(() => import("./pages/MasterStock/ManualStock/receive"));

function App() {
  const ability = createMongoAbility();
    return (
      <AbilityProvider ability={ability}>
        <main className="App relative">
          <Routes>
            <Route path="/" element={ <Suspense fallback={<Loading />}> <Login /> </Suspense>} />
            <Route path="/*" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />

              {/* Route StockOpname */}
              <Route path="stockopname" element={<StockOpname />} />
              <Route path="stockopname/create" element={<CreateStockOpname />} />
              <Route path="stockopname/detail/:uid" element={<DetailStockOpname />} />
              <Route path="stockopname/update/:uid" element={<UpdateNoteStockOpname />} />
              <Route path="manualstock" element={<ManualStock />} />
              <Route path="manualstock/detail/:uid" element={<DetailManualStock />} />
              <Route path="manualstock/receive/:uid" element={<ReceiveManualStock />} />
              
              <Route path="po" element={<PurchaseOrderDetail />} />
              <Route path="receivepo" element={<ReceivePO />} />
              <Route path="stock" element={<Stock />} />

              <Route path="po/detail/:uid" element={<DetailPONumber />} />
              
              {/* Route User */}
              <Route path="profile" element={<Profiles />} />
              <Route path="profile/setting" element={<ProfileSetting />} />
              <Route path="profile/setting/password" element={<PasswordSetting />} />

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

  // function CreateSiteProtect() {
  //   return (
  //     <ProtectedComponent
  //       action="read"
  //       permission="Tambah Cabang"
  //       component={<CreateSite />}
  //     />
  //   );
  // }
  // function UpdateSiteProtect() {
  //   return (
  //     <ProtectedComponent
  //       action="read"
  //       permission="Ubah Cabang"
  //       component={<UpdateSite />}
  //     />
  //   );
  // }

export default App;
