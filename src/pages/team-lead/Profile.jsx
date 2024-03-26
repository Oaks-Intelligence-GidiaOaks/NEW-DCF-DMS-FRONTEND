import React, { useEffect, useRef, useState } from "react";
import { EditNote } from "@mui/icons-material";
import {
  DisplayInput,
  FormInput,
  FormMultipleSelect,
} from "../../components/form";
import axios from "axios";
import { useAuth } from "../../context";
import Select from "react-select";
import { CountCard, RingsCircle } from "../../components/reusable";
import {
  getMyProfile,
  getTeamLeadSubmissionRate,
  updateMyProfile,
} from "../../lib/service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Profile = () => {
  // const { user } = useAuth();

  const avaterRef = useRef(null);

  const { mutate, isPending: mtPending } = useMutation({
    mutationKey: ["updateMyProfile"],
    mutationFn: (dt) => updateMyProfile(dt),
    onSuccess: (sx) => {
      toast.success(`Successfully updated profile`);
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const {
    data: profile,
    isLoading: prLoading,
    isSuccess: prSuccess,
  } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  const {
    data: srData,
    isLoading: srLoading,
    isSuccess: srSuccess,
  } = useQuery({
    queryKey: ["getTeamLeadSubmissionRate"],
    queryFn: getTeamLeadSubmissionRate,
  });

  let user = profile?.data.user;

  const [formFields, setFormFields] = useState({
    first_name: user?.first_name,
    last_name: user?.last_name,
    email: user?.email,
    phone_number: user?.phone_number,
    photo_url: user?.photo_url,
  });

  // component variables
  let submissionRate = srData?.data;
  console.log(profile?.data.user, "profile");

  const [image, setImage] = useState(null);
  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  let submitted = submissionRate ? submissionRate.submited : 0;
  let noResponse = submissionRate ? submissionRate.notSubmited : 0;

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFormFields({ ...formFields, photo_url: result });
        }
      };

      fileReader.readAsDataURL(image);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      ...formFields,
      role: "TeamLead",
    };

    const isError = Object.values(newUser).filter((it) => !it.length).length;

    console.log(newUser, "newUser");

    if (isError) {
      return toast.error(`Please fill all input fields`);
    }

    let bodyFormData = new FormData();

    bodyFormData.append("first_name", newUser.first_name);
    bodyFormData.append("last_name", newUser.last_name);
    bodyFormData.append("email", newUser.email);
    bodyFormData.append("phone_number", newUser.phone_number);
    bodyFormData.append("photo_url", newUser.photo_url);

    await mutate(bodyFormData);
  };

  const handlePhotoClick = () => {
    avaterRef.current.click();
  };

  const handleAvaterSelect = (e) => {
    let selectedFile = e.target.files[0];

    if (!selectedFile.type.match(imageMimeType)) {
      alert("image mime type is not valid");
      return;
    }

    setImage(selectedFile);
  };

  const handleChange = (val, field) => {
    setFormFields({ ...formFields, [field]: val });
  };

  return (
    <div className="h-full sm:mx-6 mt-6 lg:mx-auto lg:w-[90%]">
      <div className="flex items-center gap-6">
        <CountCard
          count={submitted}
          styles=" bg-white"
          text="Total submissions"
        />

        <CountCard count={noResponse} styles=" bg-white" text="No response" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 text-sm">
        <div className="mx-auto">
          <img
            src={formFields.photo_url}
            alt="avarter Img"
            className="h-44 border w-44 rounded-full bg-green-500"
          />

          <p
            onClick={handlePhotoClick}
            className="flex justify-center cursor-pointer items-center py-3"
          >
            <input
              type="file"
              className="hidden"
              ref={avaterRef}
              onChange={handleAvaterSelect}
              id=""
              accept="image/*"
            />
            <span className="">Edit photo</span>
            <EditNote />
          </p>
        </div>

        <form action="" className="flex-1 lg:pr-16" onSubmit={handleSubmit}>
          <FormInput
            placeholder="First name"
            value={formFields.first_name}
            onChange={(e) => handleChange(e.target.value, "first_name")}
            label="First name"
          />

          <FormInput
            value={formFields.last_name}
            onChange={(e) => handleChange(e.target.value, "last_name")}
            placeholder="Last name"
            label="Last name"
          />

          <FormInput
            value={formFields.email}
            onChange={(e) => handleChange(e.target.value, "email")}
            placeholder="Email"
            label="Email"
          />

          <FormInput
            value={formFields.phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 81674***"
            label="Contact number"
          />

          <DisplayInput
            label="States"
            data={user?.states.map((it) => it.name)}
          />

          <DisplayInput
            label="Districts"
            data={user?.districts.map((it) => it.name)}
          />

          <button
            disabled={mtPending}
            type="submit"
            className={`w-full mt-4 text-white p-3 grid place-items-center rounded ${
              mtPending ? "bg-gray-400" : "bg-oaksgreen"
            } cursor-pointer`}
          >
            {mtPending ? <RingsCircle /> : `Update`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
