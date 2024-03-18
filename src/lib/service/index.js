import axios from "axios";
// all api requests

// USER
export const createUser = async (userData) => {
  const data = await axios.post(`user`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const updateUserById = async (userId, userData) => {
  const data = await axios.put(`user/profile/${userId}`, userData);
  return data;
};

export const getMyProfile = async () => {
  const data = await axios.get(`user`);
  return data;
};

export const updatePassword = async (passwordData) => {
  const data = await axios.put(`user/password_update`, passwordData);
  return data;
};

export const resetPassword = async (passwordData) => {
  const data = await axios.put(`user/password/reset`, passwordData);
  return data;
};

export const getIndividualUser = async (userId) => {
  const data = await axios.get(`user/${userId}`);
  return data;
};

export const updateMyProfile = async (profileData) => {
  const data = await axios.put(`user/profile`, profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getAllSubAdmin = async () => {
  const data = await axios.get(`user/sub_admin`);
  return data;
};

export const getTeamLeadsByCountry = async (countryId) => {
  const data = await axios.get(`user/team_lead/${countryId}`);
  return data;
};

export const getAllEnumerators = async (countryId) => {
  const data = await axios.get(`user/enumerators`);
  return data;
};

export const getTeamLeadEnumerators = async (teanLeadId) => {
  const data = await axios.get(`user/enumerators/${teanLeadId}`);
  return data;
};

export const disableUser = async (userId) => {
  const data = await axios.put(`user/disable/${userId}`);
  return data;
};
export const assignUserDistrict = async (userId, districtData) => {
  const data = await axios.put(`user/district/${userId}`, districtData);
  return data;
};

// CATEGORY
export const createCategory = async (categoryData) => {
  const data = await axios.post(`category`, categoryData);
  return data;
};

export const getAllCategory = async () => {
  const data = await axios.get(`category`);
  return data;
};

export const getSingleCategory = async (categoryId) => {
  const data = await axios.get(`category/${categoryId}`);
  return data;
};

export const getCategoryByCountry = async (countryId) => {
  const data = await axios.get(`category/by_country/${countryId}`);
  return data;
};

export const updateCategory = async (categoryId) => {
  const data = await axios.put(`category/${categoryId}`);
  return data;
};

export const deleteCategory = async (categoryId) => {
  const data = await axios.delete(`category/${categoryId}`);
  return data;
};

// PRODUCT
export const createProduct = async (productData) => {
  const data = await axios.post(`product`, productData);
  return data;
};

export const getAllProduct = async () => {
  const data = await axios.get(`product`);
  return data;
};

export const getSingleProduct = async (productId) => {
  const data = await axios.get(`product/${productId}`);
  return data;
};

export const getProductsByCountry = async (countryId) => {
  const data = await axios.get(`product/by_country/${countryId}`);
  return data;
};

export const getProductsByCategory = async (categoryId) => {
  const data = await axios.get(`product/by_category/${categoryId}`);
  return data;
};

export const updateProduct = async (productId, productData) => {
  const data = await axios.put(`product/${productId}`, productData);
  return data;
};

export const deleteProduct = async (productId) => {
  const data = await axios.delete(`product/${productId}`);
  return data;
};

// COUNTRY
export const createCountry = async (countryData) => {
  const data = await axios.post(`country/single`, countryData);
  return data;
};

export const createMultipleCountries = async (countryData) => {
  const data = await axios.post(`country/bulk`, countryData);
  return data;
};

export const getAllCountries = async () => {
  const data = await axios.get(`country`);
  return data;
};

export const getCountryById = async (countryId) => {
  const data = await axios.get(`country/${countryId}`);
  return data;
};

export const updateCountry = async (countryId) => {
  const data = await axios.put(`country/${countryId}`);
  return data;
};

export const deleteCountry = async (countryId) => {
  const data = await axios.delete(`country/${countryId}`);
  return data;
};

// STATE
export const createState = async (stateData) => {
  const data = await axios.post(`state/single`, stateData);
  return data;
};

export const createMultipleStates = async (stateData) => {
  const data = await axios.post(`state/bulk`, stateData);
  return data;
};

export const getAllStates = async () => {
  const data = await axios.get(`state`);
  return data;
};

export const getAllCountryStates = async (countryId) => {
  const data = await axios.get(`state/country/${countryId}`);
  return data;
};

export const getStateById = async (stateId) => {
  const data = await axios.get(`state/${stateId}`);
  return data;
};

export const updateState = async (stateId, stateData) => {
  const data = await axios.put(`state/${stateId}`, stateData);
  return data;
};

export const deleteState = async (stateId) => {
  const data = await axios.delete(`state/${stateId}`);
  return data;
};

// DISTRICT
export const createDistrict = async (districtData) => {
  const data = await axios.post(`district/single`, districtData);
  return data;
};

export const createMultipleDistricts = async (districtData) => {
  const data = await axios.post(`district/bulk`, districtData);
  return data;
};

export const getAllDistricts = async () => {
  const data = await axios.get(`district`);
  return data;
};

export const getAllStateDistricts = async (stateId) => {
  const data = await axios.get(`district/state/${stateId}`);
  return data;
};

export const getDistrictById = async (districtId) => {
  const data = await axios.get(`district/${districtId}`);
  return data;
};

export const updateDistrict = async (districtId, districtData) => {
  const data = await axios.patch(`district/${districtId}`, districtData);
  return data;
};

export const deleteDistrict = async (districtId) => {
  const data = await axios.delete(`district/${districtId}`);
  return data;
};

// Form Submission

// Master List

// Team Lead Dashboard

// Admin Dashboard
export const getTeamLeadsCount = async () => {
  const data = await axios.get(`admin_dashboard/team_leads_count`);
  return data;
};

export const getDistrictsCount = async () => {
  const data = await axios.get(`admin_dashboard/district_count`);
  return data;
};

export const getEnumeratorCount = async (yearFilter = 2024) => {
  console.log(yearFilter, "here");

  const data = await axios.get(
    `admin_dashboard/yearly_enumerators?yearFilter=${yearFilter}`
  );
  return data;
};

export const getSubmissionCount = async () => {
  const data = await axios.get(`admin_dashboard/submission_rate`);
  return data;
};

// Form Responses
export const getProductDataByCountry = async (countryId) => {
  const data = await axios.get(`form_response/product/${countryId}`);
  return data;
};
export const getPrevProductDataByCountry = async (countryId) => {
  const data = await axios.get(`form_response/prev_product/${countryId}`);
  return data;
};

// Admin
