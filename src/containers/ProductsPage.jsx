import React from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../components/reusable";
import { FormInputDropDown } from "../components/form";
import { GeneralTable } from "../components/charts";

const sampleData = [
  {
    input_title: "Price",
    input_type: "Text",
  },
  {
    input_title: "Brand",
    input_type: "Dropdown",
    options: ["Star", "Royco", "Chicken"],
  },
  {
    input_title: "Price",
    input_type: "Long Text",
  },
];

const ProductsPage = ({ backNavPath }) => {
  return (
    <div className="md:mt-[45px]">
      <div className="flex items-center justify-between">
        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Products</span>
          <span>78</span>
        </button>

        <Link to={backNavPath}>
          <BackButton />
        </Link>
      </div>

      <div className="w-[332px] my-[30px]">
        <FormInputDropDown data={[]} />
      </div>

      <GeneralTable
        flag={{ title: "Remove", action: (row) => console.log(row) }}
        data={sampleData}
        title={"Products Table"}
      />
    </div>
  );
};

export default ProductsPage;
