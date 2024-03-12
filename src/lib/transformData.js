export function FlattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const propName = key;
    // const propName = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, FlattenObject(obj[key], propName));
    } else {
      acc[propName] = obj[key];
    }
    return acc;
  }, {});
}

export function ResponsiveLineTransform(data) {
  return (transformedData =
    data?.length > 0 &&
    data.map((item) => {
      let id = item.name;
      let dt = item[dataKey].map((obj) => {
        return {
          x: obj.x,

          y: obj.y,
        };
      });
      return [{ id, dt }];
    }));
}

export const transformData = (data) => {
  // meshedline chart
  let arr = [];

  data.map((item) => {
    const keys = Object.keys(item);
    for (const key of keys) {
      const label = key;
      const value = item[label];
      arr.push({ id: label, label, value });
    }
    // return [...arr];
  });
  console.log(arr);
  return arr;
};

export const BarChart = ({ data }) => {
  const labels = [];
  const addedData = [];
  const removedData = [];

  data?.map((item) => {
    labels.push(item.month);
    addedData.push(item.added);
    removedData.push(item.removed);
  });

  const transformedData = {
    labels,
    datasets: [
      {
        label: "Added",
        data: addedData,
        backgroundColor: "#FFAD10",
      },
      {
        label: "Removed",
        data: removedData,
        backgroundColor: "#FA0D0D",
      },
    ],
  };
  return transformedData;
};
