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

export const transformProductsGridData = (data) => {
  const newData = data.map((item) => {
    const inputs = item.inputs.reduce((acc, inp) => {
      acc[inp.title] = inp.value;
      return acc;
    });

    const tData = {
      category: item.category.name,
      product: item.product.name,
      district: item.district.name,
      state: item.state.name,
      created_by: item.created_by.first_name + item.created_by.last_name,
      flagged: item.flagged,

      ...inputs,
    };

    return tData;

    // console.log("tData", tData);
  });

  return newData;
};

export const transformProductsDataByCategory = (data) => {
  const categories = [];
  let productsByCategory = {};

  console.log("trans by data", data);

  data.forEach((item) => {
    let catObj = { _id: item.category?._id, name: item.category?.name };

    let inputs = reduceArrayToObject(item.inputs);

    let prodObj = {
      name: item.product?.name,
      district: item.district?.name,
      state: item.state?.name,
      created_by: item.created_by?.id,
      // ...rStructure,
    };

    console.log("finishing", prodObj);

    if (!categories.some((cat) => cat._id === catObj._id)) {
      categories.push(catObj);
    }

    if (!productsByCategory[item.category?._id]) {
      productsByCategory[item.category?._id] = [prodObj];
    } else {
      productsByCategory[item.category?._id].push(prodObj);
    }
  });

  return {
    categories,
    productsByCategory,
  };

  // console.log(categories, "from categries array");
  // console.log(productsByCategory, "products By Category");
};

export const transformMasterGridData = (data) => {
  // console.log("master grid data", data);

  const newGridData = [];

  data.forEach((dt) => {
    const hold = reduceProductsArrayToObject(dt.products);

    let rStructure = hold.reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {}
    );

    let last = {
      _id: dt._id,
      country: dt.country?.name,
      created_by: dt.created_by?.id,
      district: dt.district?.name,
      state: dt.state?.name,
      ...rStructure,
    };

    newGridData.push(last);
  });

  console.log(newGridData);

  return newGridData;
};

const reduceArrayToObject = (data) =>
  data.reduce((acc, inp) => {
    acc[inp.title] = inp.value;
    return acc;
  });

const reduceProductsArrayToObject = (data) => {
  const transformedData = [];

  data.forEach((item) => {
    const name = item.product.name;
    const inputs = item.inputs;

    let newInputs = inputs.reduce((acc, curr) => {
      // console.log(curr, "current");

      let objNew = {
        [`${curr.title}  ${name} `]: curr.value,
      };

      return { ...acc, ...objNew };
    }, {});

    // console.log("new inputs", newInputs);

    transformedData.push(newInputs);
  });

  // console.log("main transform", transformedData);

  return transformedData;
};
