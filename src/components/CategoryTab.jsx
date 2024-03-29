import React from "react";

import { IconButton } from "@mui/material";

const CategoryTab = ({ Icon, text }) => {
  return (
    <div className="p-2 cursor-pointer min-w-[160px]  shrink-0 flex items-center gap-2 ">
      <p className="rounded   bg-gray-100">
        <IconButton style={{ color: "black" }}>
          <Icon />
        </IconButton>
      </p>

      <p className="">{text}</p>
    </div>
  );
};

export default CategoryTab;
