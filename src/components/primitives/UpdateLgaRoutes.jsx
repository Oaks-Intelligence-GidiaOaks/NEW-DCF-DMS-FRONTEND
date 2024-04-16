import React, { useEffect, useState } from "react";
import { FormInputDropDown, FormInputEditable, TextInput } from "../form";
import { AllStates } from "../../data/form/states";
import { Rings } from "react-loader-spinner";
import { allLgasByState } from "../../data/form/allLgasByState";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createRoute,
  getAllCountryStates,
  getAllStateDistricts,
  getRoutesByDistrict,
  updateRoute,
} from "../../lib/service";
import { toast } from "react-toastify";
import { useAuth } from "../../context";
import {
  transformDistrictsFormData,
  transformStateFormData,
} from "../../lib/utils";
import { GeneralTable } from "../charts";

const UpdateLgaRoutes = ({ lgaRoutes }) => {
  const { user } = useAuth();

  // component states
  const [inputRoute, setInputRoute] = useState({
    start: "",
    end: "",
  });

  const [formFields, setFormFields] = useState({
    country_id: user.country,
    state_id: "",
    district_id: "",
    routes: [],
  });

  const { mutate, isPending: mtPending } = useMutation({
    mutationKey: ["updateRoute"],
    mutationFn: (dt) => updateRoute(dt),
    onSuccess: (sx) => {
      toast.success(`district routes updated successfully`);
      resetForm();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // get states in a country
  const {
    data: states,
    isLoading: stLoading,
    isSuccess: stSuccess,
  } = useQuery({
    queryKey: ["getAllCountryStates"],
    queryFn: () => getAllCountryStates(user.country),
  });

  // get districts in a state
  const {
    data: districts,
    isLoading: dtLoading,
    isSuccess: dtSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getAllStateDistricts"],
    queryFn: () => getAllStateDistricts(formFields.state_id),
    enabled: formFields.state_id.length > 0,
    refetchOnMount: false,
  });

  // get all routes in a district query
  const {
    data: dstRoutes,
    isLoading: dstLoading,
    isSuccess: dstSuccess,
    refetch: dstRefetch,
  } = useQuery({
    queryKey: ["getDistrictRoutes"],
    queryFn: () => getRoutesByDistrict(formFields.district_id),
    enabled: formFields.district_id.length > 1,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (formFields.state_id.length > 0) {
      refetch();
    }
  }, [refetch, formFields.state_id]);

  useEffect(() => {
    if (formFields.district_id.length > 0) {
      (async () => {
        const { data } = await dstRefetch();

        toast.success("lga routes populated");

        let newRoutes = data.data.data[0]?.routes || [];

        setFormFields({
          ...formFields,
          routes: newRoutes,
        });
      })();
    }
  }, [dstRefetch, formFields.district_id]);

  // component variables
  const countryStates = stSuccess
    ? transformStateFormData(states.data.data)
    : [];

  const stateDistricts = dtSuccess
    ? transformDistrictsFormData(districts.data.data)
    : [];

  // const districtRoutes = dstSuccess ? dstRoutes.data.data[0]?.routes : [];

  const handleinputRouteChange = (val, fieldName) => {
    setInputRoute({ ...inputRoute, [fieldName]: val });
  };

  const handleChange = (val, fieldName) => {
    setFormFields({ ...formFields, [fieldName]: val });
  };

  const addInputRoute = (route) => {
    let isError = !!Object.values(route).filter((it) => !it.length).length;

    let error2 = false;

    if (formFields.routes.length === 3) {
      error2 = true;
    }

    if (isError) {
      return toast.error(`Please fill all input fields`);
    }

    if (error2) {
      return toast.error(`you can only add 3 routes per district`);
    }

    const no = parseInt(formFields.routes.length) + 1;

    const tRoute = {
      ...route,
      name: `route ${no}`,
    };

    clearRoutes();

    let newInputs = [...formFields.routes, tRoute];
    handleChange(newInputs, "routes");
  };

  const removeInputRoute = (route) => {
    let newInputs = [...formFields.routes]
      .filter((it) => it.name !== route.name)
      .map((it, i) => ({ ...it, name: `Route ${i + 1}` }));

    handleChange(newInputs, "routes");
  };

  const clearRoutes = () => {
    setInputRoute({
      start: "",
      end: "",
    });
  };

  const resetForm = () => {
    setFormFields({
      country_id: user.country,
      state_id: "",
      district_id: "",
      routes: [],
    });

    clearRoutes();
  };

  const handleFormSubmit = async (e) => {
    // e.preventDefault();

    const isError = Object.values(formFields).filter((it) => !it.length).length;

    if (isError) {
      return toast.error(`Please fill in all input fields`);
    }

    const newRoutes = {
      districtId: formFields.district_id,
      data: { ...formFields },
    };

    // console.log("newRoutes", newRoutes);

    await mutate(newRoutes);
  };

  return (
    <div>
      <div action="" className="w-full px-2" onSubmit={handleFormSubmit}>
        <FormInputDropDown
          label="State"
          data={countryStates}
          onChange={(val) => handleChange(val, "state_id")}
          index="z-20"
        />

        <FormInputDropDown
          label="Districts"
          onChange={(val) => handleChange(val, "district_id")}
          data={stateDistricts}
          index="z-10"
        />

        {formFields.district_id.length > 0 && (
          <div className="bg-white py-4 px-3 rounded-md drop-shadow-sm">
            <div>
              <h2>Routes Data</h2>
            </div>

            <div className=" lg:items-center grid grid-cols-1 md:grid-cols-1">
              <TextInput
                label="Start"
                value={inputRoute.start}
                onChange={(e) =>
                  handleinputRouteChange(e.target.value, "start")
                }
              />

              <TextInput
                label="End"
                value={inputRoute.end}
                onChange={(e) => handleinputRouteChange(e.target.value, "end")}
              />

              <button
                onClick={() => addInputRoute(inputRoute)}
                className="h-[40px] w-[95%] mx-auto rounded-[5px] text-center font-[500] text-xs text-[#82B22E] mt-[10px] border border-[#82B22E]"
              >
                Add Input
              </button>
            </div>

            <div>
              <GeneralTable
                height={100}
                flag={{
                  title: "Remove",
                  action: (row) => {
                    removeInputRoute(row);
                    console.log(row, "row");

                    // const newInputs = [...formFields.routes].filter(
                    //   (it) => it.name !== row.name
                    // );
                    // handleChange(newInputs, "routes");
                  },
                }}
                data={formFields.routes}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleFormSubmit}
          className="bg-oaksgreen w-full text-xs grid place-items-center mx-2 text-white p-3 
        my-6 rounded"
        >
          {mtPending ? (
            <Rings
              height="36"
              width="36"
              color="#ffffff"
              radius="6"
              wrapperStyle={{ backgoundColor: "yellow" }}
              wrapperClass=""
              visible={true}
              ariaLabel="rings-loading"
            />
          ) : (
            "Update"
          )}
        </button>
      </div>
    </div>
  );
};

export default UpdateLgaRoutes;
