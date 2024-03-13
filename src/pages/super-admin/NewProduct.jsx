import React from "react";
import { CreateProductForm } from "../../containers";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { BackButton } from "../../components/reusable";

const NewProduct = () => {
  return (
    <div className="pt-[40px] md:pl-[70px] ">
      <div className="flex items-center flex-wrap gap-7 mb-[36px]">
        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Categories</span>
          <span>78</span>
        </button>

        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Products</span>
          <span>78</span>
        </button>

        <Link to="/super_admin/configuration">
          <BackButton />
        </Link>
      </div>

      <CreateProductForm />
    </div>
  );
};

export default NewProduct;
