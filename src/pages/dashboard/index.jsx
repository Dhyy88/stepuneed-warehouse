import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import RevenueBarChart from "@/components/partials/widget/chart/revenue-bar-chart";
import RadialsChart from "@/components/partials/widget/chart/radials";
import SelectMonth from "@/components/partials/SelectMonth";
import CompanyTable from "@/components/partials/Table/company-table";
import RecentActivity from "@/components/partials/widget/recent-activity";
import HomeBredCurbs from "./HomeBredCurbs";
import Alert from "@/components/ui/Alert";

import ApiEndpoint from "../../API/Api_EndPoint";
import axios from "../../API/Axios";

const Dashboard = () => {
  // const getProfile = async () => {
  //   await axios.get(ApiEndpoint.DETAIL).then((response) => {
  //     console.log(response.data.data);
  //   });
  // };

  // useEffect(() => {
  //   getProfile();
  // }, []);

  return (
    <div>
      <HomeBredCurbs title="Dashboard" />
      <Alert
          icon="heroicons-outline:exclamation"
        className="light-mode alert-primary mb-5"
      >
        Selamat datang !, Statistik data dashboard saat ini belum tersedia, silahkan explore menu yang sudah tersedia 
      </Alert>
      {/* <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="2xl:col-span-12 lg:col-span-8 col-span-12">
          <Card bodyClass="p-4">
            <div className="grid md:grid-cols-3 col-span-1 gap-4">
              <GroupChart1 />
            </div>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="lg:col-span-8 col-span-12">
          <Card>
            <div className="legend-ring">
              <RevenueBarChart />
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Overview" headerslot={<SelectMonth />}>
            <RadialsChart />
          </Card>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card title="All Company" headerslot={<SelectMonth />} noborder>
            <CompanyTable />
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Recent Activity" headerslot={<SelectMonth />}>
            <RecentActivity />
          </Card>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
