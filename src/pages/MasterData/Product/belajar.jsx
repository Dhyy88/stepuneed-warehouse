import React from "react";
import { dataa } from "./data";
import Card from "../../../components/ui/Card";

const RecursiveComponent = ({ data }) => {
  return (
    <>
        <div style={{ paddingLeft: "20px" }}>
          {data.map((parent) => {
            return (
              <>
                <div className="flex row col-lg-12 gap-5">
                  <div key={parent.name} className="col-lg-6">
                    <ul>
                      <li>{parent.name}</li>
                    </ul>
                  </div>
                  {parent.children && (
                    <div className="col-lg-4">
                      <ul>
                        <li>
                          <RecursiveComponent data={parent.children} />
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </>
            );
          })}
        </div>
    </>
  );
};

const App = () => {
  return (
    <div style={{ margin: "8px" }}>
      <RecursiveComponent data={dataa} />
    </div>
  );
};
export default App;
