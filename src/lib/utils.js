export const transformCategoryGridData = (data) => {
  const newData = data.map((item, index) => ({
    _id: item._id,
    category_name: item.country.name,
    input_name: item.expected_inputs,
  }));

  return newData;
};

export const transformSubAdminGridData = (data) => {
  const newData = data.map((item) => {
    const {
      identity_image_url,
      photo_url,
      role,
      createdAt,
      updatedAt,
      firstUse,
      disabled,
      states,
      districts,
      ...rest
    } = item;

    const newD = {
      ...rest,
      // states: rest.states.map((it) => it.name),
      // districts: rest.districts.map((it) => it.name),
      country: rest.country.name,
    };

    return newD;
  });

  return newData;
};

export const transformCountryFormData = (data) => {
  const newData = data.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  return newData;
};

export const transformStateFormData = (data) => {
  const newData = data.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  return newData;
};

export const transformCategoryFormData = (data) => {
  let expectedInputs = {};
  let categoryIds = [];

  data.forEach((item) => {
    categoryIds.push({ label: item.name, value: item._id });

    expectedInputs[item._id] = item.expected_inputs.map((it) => ({
      label: it,
      value: it,
    }));
  });

  return {
    expectedInputs: expectedInputs,
    categoryIds: categoryIds,
  };
};
