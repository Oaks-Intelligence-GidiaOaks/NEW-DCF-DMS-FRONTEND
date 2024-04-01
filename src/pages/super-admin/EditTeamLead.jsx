import React, { useEffect, useRef, useState } from "react";
import { FormInputNumber, TextInput } from "../../components/form";
import FormMultipleSelect from "../../components/form/FormMultipleSelect";
import { useAuth } from "../../context";
import { BackButton, RingsCircle } from "../../components/reusable";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllCountryStates,
  getIndividualUser,
  getMultipleDistricts,
  updateUserById,
} from "../../lib/service";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

const EditTeamLead = () => {
  const { teamLeadId } = useParams();

  const { mutate, isPending: mutateLoading } = useMutation({
    mutationKey: ["updateUserById"],
    mutationFn: (data) => updateUserById(data),
    onSuccess: (sx) => {
      toast.success(`user updated successfully.`);
      resetForm();
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  // get team lead profile
  const {
    data: teamLead,
    isLoading: tlLoading,
    isSuccess: tlSuccess,
  } = useQuery({
    queryKey: ["getIndividualUser"],
    queryFn: () => getIndividualUser(teamLeadId),
  });

  let tlStateIds = tlSuccess
    ? teamLead.data.data.states.map((it) => it._id)
    : [];

  let tlLgaIds = tlSuccess
    ? teamLead.data.data.districts.map((it) => it._id)
    : [];

  const [stateIds, setStateIds] = useState(tlStateIds);
  const [lgaIds, setLgaIds] = useState(tlLgaIds);

  const first_name = teamLead?.data?.data.first_name;
  const last_name = teamLead?.data?.data.last_name;
  const email = teamLead?.data?.data.email;
  const phone_number = teamLead?.data?.data.phone_number;

  // get country states
  const {
    data: countryStates,
    isLoading: stLoading,
    isSUccess: stSuccess,
  } = useQuery({
    queryKey: ["getAllCountryStates"],
    queryFn: () => getAllCountryStates(teamLead.data.data.country._id),
    enabled: tlSuccess,
  });

  // get state districts
  const {
    data: stateDistricts,
    isLoading: dsLoading,
    isSUccess: dsSuccess,
    refetch,
  } = useQuery({
    queryKey: ["getAllStateDistricts"],
    queryFn: () => getMultipleDistricts(stateIds),
    enabled: !!stateIds.length,
  });

  // component variables
  let cStates = countryStates?.data.data.map((it) => ({
    value: it._id,
    label: it.name,
  }));

  let cDistricts = stateDistricts?.data.data.map((it) => ({
    value: it._id,
    label: it.name,
  }));

  const tlStates = teamLead?.data.data.states.map((it, i) => ({
    label: it.name,
    value: it._id,
  }));

  const tlDistricts = teamLead?.data.data.districts.map((it, i) => ({
    label: it.name,
    value: it._id,
  }));

  useEffect(() => {
    refetch();
  }, [stateIds, refetch]);

  const [formFields, setFormFields] = useState({
    firstName: first_name,
    lastName: last_name,
    email: email,
    tel: phone_number,
  });

  const resetForm = () => {
    setFormFields({
      firstName: first_name,
      lastName: last_name,
      email: email,
      tel: phone_number,
    });

    setStateIds(tlStateIds);
    setLgaIds(tlLgaIds);
  };

  const handleStateChange = (selectedOptions) => {
    setStateIds(selectedOptions.map((it) => it.value));
    setLgaIds([]);
  };

  const handleLgaChange = (selectedOptions) => {
    setLgaIds(selectedOptions.map((it) => it.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, tel, idNo, idType } = formFields;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !tel ||
      !stateIds.length ||
      !lgaIds.length
    ) {
      toast.error("Please input all fields");
      return;
    }

    let transformedStates = stateIds;
    let transformedLgas = lgaIds;
    const formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", tel);
    formData.append("role", "TeamLead");

    // Append list items to form data
    transformedLgas.forEach((lga) => formData.append("districts", lga));
    transformedStates.forEach((state) => formData.append("states", state));

    const mtData = {
      userId: teamLeadId,
      userData: formData,
    };

    await mutate(mtData);
  };

  if (tlLoading) {
    return (
      <div className="text-center h-32 flex flex-col justify-end">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="lg:w-4/5 mx-auto py-6 text-sm">
      <div className="mt-3 mb-4 flex items-center justify-between">
        <p className="text-base font-bold">Edit Team Lead profile</p>

        <Link to={`/admin/team_leads/${teamLeadId}`}>
          <BackButton />
        </Link>
      </div>

      <form action="" className="lg:w-5/6" onSubmit={handleSubmit}>
        <TextInput
          placeholder="First name"
          label="First name"
          value={formFields.firstName}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />
        <TextInput
          placeholder="Last name"
          label="Last name"
          value={formFields.lastName}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />

        <TextInput
          placeholder="Email"
          label="Email address"
          value={formFields.email}
          type={"email"}
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <FormInputNumber
          label="Contact number"
          onChange={(e) =>
            setFormFields((prev) => ({ ...prev, tel: e.target.value }))
          }
          placeholder="090 26***"
          value={formFields.tel}
        />

        <FormMultipleSelect
          label="States"
          defaultValue={tlStates}
          data={cStates}
          index="z-30"
          onChange={handleStateChange}
        />

        {/* {states.length > 0 && ( */}
        <FormMultipleSelect
          label="Districts"
          defaultValue={tlDistricts}
          onChange={handleLgaChange}
          data={cDistricts}
          index="z-20"
        />

        <button className="w-full mt-4 text-white grid place-items-center p-3 rounded bg-oaksgreen">
          {mutateLoading ? <RingsCircle /> : "Update"}
        </button>
      </form>
    </div>
  );
  ``;
};

export default EditTeamLead;
