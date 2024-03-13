import React from "react";
import { CreateCategoryForm } from "../../containers";
import { IoIosArrowBack } from "react-icons/io";
import { BackButton } from "../../components/reusable";
import { Link } from "react-router-dom";

const NewCategory = () => {
  return (
    <div className="pt-[40px] md:pl-[70px]">
      <div className="flex justify-between items-center">
        <button className="h-[48px] px-[22px] gap-6 flex items-center bg-white font-[500] text-xs leading-[18px]">
          <span className="">Total Categories</span>
          <span>78</span>
        </button>

        <Link to="/super_admin/configuration">
          <BackButton />
        </Link>
      </div>

      <div className="">
        <CreateCategoryForm />
      </div>
    </div>
  );
};

export default NewCategory;
