import React from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../components/reusable";
import { GeneralTable } from "../components/charts";

const ProductsPage = ({ backNavPath, data, flag, action }) => {
  return (
    <div className="md:mt-[45px]">
      <div className="flex items-center justify-between">
        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Products</span>
          <span>{data?.length}</span>
        </button>

        <Link to={backNavPath}>
          <BackButton />
        </Link>
      </div>

      <GeneralTable
        flag={flag}
        data={data}
        title={`Products Table`}
        actions={action}
        commands={[]}
      />
    </div>
  );
};

export default ProductsPage;
