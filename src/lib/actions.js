export const gridActions = {
  categoryGrid: [
    {
      title: "Edit",
      action: (row) => {
        console.log("Edit clicked", row);
      },
    },
    {
      title: "See more",
      action: (row) => {
        console.log("See more clicked", row);
        // navigate(`/super_admin/configuration/category_products/${row._id}`);
      },
    },
    {
      title: "Remove",
      action: (row) => {
        console.log("Remove clicked", row);
      },
    },
  ],
};
