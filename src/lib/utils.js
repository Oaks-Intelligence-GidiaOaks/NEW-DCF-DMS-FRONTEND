export const transformCategoryGridData = (data) => {
  console.log(data, "bvdcgdvhb");

  const newData = data.map((item, index) => ({
    _id: item._id,
    "Category name": item.name,
    "Expected Inputs": item.expected_inputs,
  }));

  return newData;
};

export const transformCategoryProductsGridData = (data) => {
  const newData = data?.map((item, i) => {
    const inputs = item.inputs?.map((it, i) => it.title);

    const tItem = {
      _id: item._id,
      name: item.name,
      caegory_id: item.category?._id,
      category_name: item.category?.name,
      country_id: item.country?._id,
      country_name: item.country?.name,
      currency: item.country?.currency?.symbol,
      inputs,
    };

    return tItem;
  });

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
      country_id: rest.country._id,
    };

    return newD;
  });

  return newData;
};

export const transformEnumeratorsGridData = (data) => {
  const newData = data?.map((item) => {
    const {
      identity_image_url,
      photo_url,
      role,
      createdAt,
      updatedAt,
      firstUse,
      disabled,
      // states,
      // districts,
      ...rest
    } = item;

    const newD = {
      ...rest,
      states: rest.states.map((it) => it.name),
      districts: rest.districts.map((it) => it.name),
      country: rest.country?.name,
    };

    return newD;
  });

  return newData;
};

export const transformTeamLedsGridData = (data) => {
  console.log("team leads", data);

  const newData = data.map((item) => {
    const {
      identity_image_url,
      photo_url,
      role,
      createdAt,
      updatedAt,
      firstUse,
      disabled,
      // states,
      districts,
      ...rest
    } = item;

    const newD = {
      ...rest,
      states: rest.states.map((it) => it.name),
      // districts: rest.districts.map((it) => it.name),
      country: rest.country?.name,
      _id: rest._id,
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

export const transformDistrictsFormData = (data) => {
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

    console.log("check here", item);

    const tData = {
      category: item?.category?.name,
      product: item?.product?.name,
      district: item?.district?.name,
      state: item?.state?.name,
      created_by: item?.created_by?.first_name + item?.created_by?.last_name,
      flagged: item?.flagged,

      ...inputs,
    };

    return tData;
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

export const transformProductGridData = (data) => {
  const newData = data?.map((item) => {
    const inputs = item.inputs.reduce((acc, curr) => {
      // change to value
      acc[curr.title] = curr.value;

      return acc;
    }, {});

    const tData = {
      _id: item._id,
      name: item.product?.name,
      ...inputs,
      createdAt: item?.createdAt,
      created_by: item.created_by?.id,
      district: item.district?.name,
      flagged: item.flagged,
    };

    console.log(tData, "tData");

    return tData;
  });

  return newData;
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

  // console.log(newGridData);

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

    transformedData.push(newInputs);
  });

  return transformedData;
};

// charts
export const transformAdminSubmissionTime = (data) => {
  console.log("transformAdminSubmissionTime", data);
  const newData = [];

  data.forEach((it, i) => {
    const newObj = {
      id: it.district?.name,
      data: it.weeklyValues?.map((wv, wi) => ({
        x: wv?.weekNo,
        y: new Date(wv?.submissionTime),
      })),
    };

    newData.push(newObj);
  });

  console.log(newData, "new Data");

  return newData;
};

// Audit Logs
export const transformLogsGridData = (data) => {
  const newData = [...data].map((item) => {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      time: formatGridDate(item.createdAt),
    };
  });

  return newData;
};

export const formatChartDate = (date) => {
  const options = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    timeZone: "Africa/Lagos",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options);
};

export const tooltipConfig = {
  format: (value) => formatChartDate(value),
};

export const formatGridDate = (dateData) => {
  let newData = new Date(dateData).toLocaleDateString("en-NG", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Adjust for 12-hour format (pm/am)
  });

  return newData;
};

export const filterExpectedInputs = (allExpectedInputs, selectedInputs) => {
  const selectedValues = new Set(selectedInputs.map(({ title }) => title));
  let data = allExpectedInputs.filter(
    ({ value }) => !selectedValues.has(value)
  );

  console.log(data, "data");

  return data;
};
