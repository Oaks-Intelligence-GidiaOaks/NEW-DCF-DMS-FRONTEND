export const transformCategoryGridData = (data) => {
  const newData = data.map((item, index) => ({
    _id: item._id,
    category_name: item.country.name,
    input_name: item.expected_inputs,
  }));

  return newData;
};
