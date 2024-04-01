import React from "react";
import { Link } from "react-router-dom";
import { BackButton } from "../components/reusable";
import { GeneralTable } from "../components/charts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateProduct } from "../lib/service";
import {
  categoryProductsHiddenFields,
  categoryProductsNonEditableFields,
  userNonEditableFields,
} from "../lib/actions";

const ProductsPage = ({ backNavPath, data, action, handleSave }) => {
  const commands = [
    {
      type: "Edit",
      buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" },
    },
    {
      type: "Save",
      buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" },
    },
    {
      type: "Cancel",
      buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" },
    },
  ];

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
        data={data}
        title={`Category Products Table`}
        height={350}
        commands={commands}
        handleSave={handleSave}
        hiddenFields={categoryProductsHiddenFields}
        nonEditableFields={categoryProductsNonEditableFields}
        pageSize={60}
        actions={action}
      />
    </div>
  );
};

export default ProductsPage;
