import React, { useState, useEffect } from "react";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
  Filter,
  Inject,
  Page,
  Edit,
  Sort,
  beginEdit,
  Toolbar,
  Group,
  CommandColumn,
} from "@syncfusion/ej2-react-grids";
import * as XLSX from "xlsx";
import { BiDownload } from "react-icons/bi";
import { FadeLoader } from "react-spinners";
// import { rows } from "../data/old-dms/tableData";
// import more from "../assets/more.svg";
import { MdMoreHoriz } from "react-icons/md";

const GeneralTable = ({
  data,
  pageSize,
  title,
  actions,
  flag,
  commands,
  handleQuery,
  handleSave,
}) => {
  if (!data) return;
  const masterRow = data;
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  let downloadData = masterRow;

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu component
      if (event.target.closest("#menu") === null) {
        setIsMenuOpen(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Detach the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []); // Empty dependency array ensures that the effect runs only once after mounting

  const handleMenuToggle = (event) => {
    event.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    // setSelectedUser(user);
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.top + rect.height,
      left: rect.left,
    });
  };

  function getTableColumnData(arr) {
    let maxKeys = 0;
    let objectWithMostKeys = null;

    for (let obj of arr) {
      const keysCount = Object.keys(obj).length;

      if (keysCount > maxKeys) {
        maxKeys = keysCount;
        objectWithMostKeys = obj;
      }
    }
    return objectWithMostKeys;
  }

  let masterColumn =
    masterRow && masterRow.length > 0
      ? Object.keys(getTableColumnData(masterRow)).map((item) => (
          <ColumnDirective
            visible={
              item !== "_id" &&
              item !== "created_by" &&
              item !== "__v" &&
              item !== "created_at" &&
              item !== "createdAt" &&
              item !== "updatedAt" &&
              item !== "updated_at"
            }
            headerText={item !== null && item}
            key={item}
            field={item}
            width={item === "Note" ? 300 + item.length : 180 + item.length}
          />
        ))
      : [];

  // const toolbarOptions = ["Edit", "Delete", "Update", "Cancel"];
  const pageSettings = { pageSize };
  const sortSettings = { colums: [{ field: "state", direction: "Ascending" }] };

  const ActionTemplate = (rwdata) => {
    return (
      <div className="relative">
        <div
          className="hover:cursor-pointer"
          onClick={(e) => {
            setSelectedUser(rwdata);
            handleMenuToggle(e);
          }}
        >
          {/* <img src={more} alt="action button" /> */}
          <MdMoreHoriz />
        </div>

        {isMenuOpen && (
          <div
            id="menu"
            className={`popup-menu fixed flex flex-col gap-1 p-3 rounded bg-blue-100 drop-shdow-sm z-50`}
            style={{ top: popupPosition.top, left: popupPosition.left }}
          >
            {actions.map((ac) => {
              return (
                <button
                  key={ac.title}
                  style={{
                    color: ac.title.toLowerCase() === "delete" ? "red" : "",
                  }}
                  className="hover:text-gray-700"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                    // console.log(selectedUser);
                    ac.action(selectedUser);
                  }}
                >
                  {ac.title}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const flagTemplate = (rowData) => {
    return (
      <div>
        <div>
          <button
            onClick={() => flag.action(rowData)}
            className="bg-danger text-white px-2 py-1 rounded text-xs"
          >
            {flag.title}
          </button>
        </div>
      </div>
    );
  };

  const editSettings = {
    allowEditing: true,
    // mode: "Dialog",
    // allowAdding: true,
    // allowDeleting: true,
    // newRowPosition: "Top",
  };

  const handleDownload = () => {
    const columnHeaders = Object.keys(getTableColumnData(downloadData));

    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet([]);

    XLSX.utils.sheet_add_aoa(ws, [columnHeaders], { origin: "A1" });

    if (Array.isArray(downloadData)) {
      let rowData = downloadData.map((obj) =>
        columnHeaders.map((header) => obj[header])
      );

      XLSX.utils.sheet_add_aoa(ws, rowData, { origin: "A2" });
    } else {
      let rowData = columnHeaders.map((header) => [downloadData[header]]);
      XLSX.utils.sheet_add_aoa(ws, rowData, { origin: "A2" });
    }

    XLSX.utils.book_append_sheet(wb, ws, "EXCEL-SHEET");
    XLSX.writeFile(wb, "Excel-sheet.xlsx");
  };

  const serialNumberTemplate = (rowData) => {
    return rowData ? Number(rowData.index) + 1 : "";
  };

  return masterRow ? (
    <div className="p-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{title}</div>
        <div className="my-3">
          <button
            onClick={handleDownload}
            className="px-3 ml-auto p-2 flex items-center space-x-3 rounded-md drop-shadow-lg text-sm bg-white hover:bg-oaksyellow hover:text-white"
          >
            <div className="w-fit p-1 rounded text-black bg-gray-100">
              <BiDownload />
            </div>
            <span className="pr-6 text-xs">Download</span>
          </button>
        </div>
      </div>

      <div className="text-[7px]">
        <GridComponent
          dataSource={masterRow}
          allowPaging={true}
          allowSorting={true}
          sortSettings={sortSettings}
          pageSettings={pageSettings}
          allowEditing={true}
          editSettings={editSettings}
          allowGrouping={true}
          allowTextWrap={true}
          textWrapSettings={{ wrapMode: "Content" }}
          height={350}
          queryCellInfo={handleQuery}
          actionComplete={handleSave}
        >
          <ColumnsDirective>
            <ColumnDirective
              headerText="S/N"
              width={80}
              template={serialNumberTemplate}
            />
            {masterColumn}
            {actions && (
              <ColumnDirective
                headerText="Actions"
                width={100}
                template={ActionTemplate}
              />
            )}
            {commands && (
              <ColumnDirective
                headerText="Action"
                width={100}
                commands={commands}
              />
            )}
            {flag && (
              <ColumnDirective
                headerText={flag.title}
                width={100}
                template={flagTemplate}
                // visible={user?.role === "admin"}
              />
            )}
          </ColumnsDirective>
          <Inject
            services={[
              data.length > pageSize && Page,
              Sort,
              Filter,
              Group,
              Toolbar,
              Edit,
              CommandColumn,
            ]}
          />
        </GridComponent>
      </div>
    </div>
  ) : (
    <div className="text-center h-[320px] w-full grid place-items-center">
      <div className="w-full my-auto py-6 grid place-items-center">
        <FadeLoader color="gray" radius={1} width={3} height={10} size={30} />
      </div>
    </div>
  );
};

GeneralTable.defaultProps = {
  // data: rows,
  // pageSize: 10,
  // handleQuery: (args) => {
  // if (
  //   args.column.field === "price" &&
  //   isOutsideLimit(avgData, "food", args.data)
  // ) {
  //   args.cell.classList.add("red-text");
  // }
  // },
  // handleSave: (args) => {
  // if (
  //   args.column.field === "price" &&
  //   isOutsideLimit(avgData, "food", args.data)
  // ) {
  //   args.cell.classList.add("red-text");
  // }
  // },
  // title: "Title Goes Here",
  // commands: [
  //   {
  //     type: "Edit",
  //     buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" },
  //   },
  //   {
  //     type: "Save",
  //     buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" },
  //   },
  //   {
  //     type: "Cancel",
  //     buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" },
  //   },
  // ],
  // flag: {
  //   title: "DEL",
  //   action: (d) => {
  //     console.log("FLAG: ", d);
  //   },
  // },
  // actions: [
  //   {
  //     title: "Delete",
  //     action: (d) => {
  //       console.log("action Clicked", d);
  //     },
  //   },
  //   {
  //     title: "Edit",
  //     action: (d) => {
  //       console.log("action Clicked", d);
  //     },
  //   },
  //   {
  //     title: "Others",
  //     action: (d) => {
  //       console.log("action Clicked", d);
  //     },
  //   },
  // ],
};

export default GeneralTable;
