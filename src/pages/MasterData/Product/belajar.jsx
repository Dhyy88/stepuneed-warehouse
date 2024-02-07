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
                    <ReactQuill
                      theme="snow"
                      placeholder="Masukkan deskripsi produk..."
                      value={description}
                      onChange={setDescription}
                      // modules={{
                      //   toolbar: [
                      //     [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      //     ["bold", "italic", "underline", "strike"],
                      //     [{ list: "ordered" }, { list: "bullet" }],
                      //     ["clean"],
                      //   ],
                      // }}
                      modules={{
                        toolbar: [
                          ["bold", "italic", "underline", "strike"], // basic formatting
                          ["blockquote", "code-block"], // blockquote and code
                          [{ header: 1 }, { header: 2 }], // header style
                          [{ list: "ordered" }, { list: "bullet" }], // lists
                          [{ script: "sub" }, { script: "super" }], // subscript/superscript
                          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                          [{ direction: "rtl" }], // text direction
                          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                          [{ header: [1, 2, 3, 4, 5, 6, false] }], // header dropdown
                          [{ color: [] }, { background: [] }], // dropdown with defaults
                          [{ font: [] }], // font family
                          [{ align: [] }], // text align
                          ["clean"], // remove formatting
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "list",
                        "bullet",
                        "script",
                        "sub",
                        "super",
                        "indent",
                        "outdent",
                        "color",
                        "background",
                        "align",
                        "clean",
                      ]}
                    />
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
