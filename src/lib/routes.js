import routesData from "../constants/districtRoutes.json";
import { createRoute, getAllDistricts, getRoutesByCountry } from "./service";

export const seedDistrictRoutess = async (data) => {
  // Define a recursive function to process the data
  const processRoutes = async (index) => {
    // Base case: if index exceeds the length of data, stop recursion
    if (index >= data.length) return;

    try {
      // Create the route at the current index
      await createRoute(data[index]);
      console.log(`Route ${index + 1} created`);

      // Recursively process the next item
      await processRoutes(index + 1);
    } catch (error) {
      // Log the error and stop further execution
      console.error(`Error creating route at index ${index}: ${error.message}`);
    }
  };

  // Start processing routes from the first item (index 0)
  await processRoutes(0);
};

export const seedDistrictRoutes = async (data) => {
  // let data = dataa.slice(0, 2);

  for (const item of data) {
    try {
      await createRoute(item);
      console.log(`Route created`);
    } catch (error) {
      console.error(`Error creating route: ${error.message}`);
      break; // Stop execution if there's an error
    }
  }
};

export const getDistrictRoutesLgas = async () => {
  const allRoutes = await getRoutesByCountry("65e344bff0eab8c4f2552abe");

  let lRoutes = allRoutes.data.data;

  const lgas = lRoutes.map((it) => it.name);

  console.log(lgas);
};

const country_id = "65e344bff0eab8c4f2552abe";

export const transformRoutesJson = async (data) => {
  const { data: districts } = await getAllDistricts();

  let tDistricts = districts.data.map(
    ({ updatedAt, createdAt, __v, _id, name, ...rest }) => ({
      ...rest,
      LGA: name,
      district_id: _id,
      country_id,
    })
  );

  // console.log("new districts", tDistricts);

  let reshapedArray = Object.values(
    data.reduce((acc, curr) => {
      const { LGA, Start, End } = curr;
      if (!acc[LGA]) {
        acc[LGA] = { lga: LGA, routes: [] };
      }
      acc[LGA].routes.push({
        name: `route ${acc[LGA].routes.length + 1}`,
        start: Start,
        end: End,
      });
      return acc;
    }, {})
  );

  reshapedArray.forEach((item) => {
    const matchingItem = tDistricts.find((elem) => elem.LGA == item.lga);
    if (matchingItem) {
      item.state_id = matchingItem.state_id;
      item.district_id = matchingItem.district_id;
      item.country_id = matchingItem.country_id;
    }
  });

  // console.log("tDistricts", tDistricts);
  // const jsonString = JSON.stringify(reshapedArray, null, 2);
  // const blob = new Blob([jsonString], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = "test.json";
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);

  return reshapedArray;
};
