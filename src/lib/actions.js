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

export const commands = [
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

export const userNonEditableFields = [
  "id",
  "states",
  "districts",
  "country",
  "identityType",
];

export const categoryNonEditableFields = ["country_id"];
export const categoryProductsNonEditableFields = [
  "country_id",
  "country_name",
  "category_id",
  "category_name",
  "currency",
];
export const categoryProductsHiddenFields = ["country_id", "category_id"];
