import React, { useEffect, useRef, useState } from "react";
import { EditNote } from "@mui/icons-material";
import { FormInput } from "../../components/form";
import { useAuth } from "../../context";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "../../lib/service";
import { toast } from "react-toastify";
import { SkeletonLoaders } from "../../components/reusable";

const Profile = () => {
  const avaterRef = useRef(null);

  const { mutate, isPending: mtPending } = useMutation({
    mutationKey: ["updateMyProfile"],
    mutationFn: (dt) => updateMyProfile(dt),
    onSuccess: (sx) => {
      toast.success(`Successfullu updated user profile`);
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

  // component variables
  let user = profile?.data.user;

  const [firstName, setFirstName] = useState(user?.first_name);
  const [lastName, setLastName] = useState(user?.last_name);
  const [email, setEmail] = useState(user?.email);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    user?.photo_url ||
      `https://res.cloudinary.com/emmaotuonye1/image/upload/v1686759696/avatars/Avatar-2_lmptpe.png`
  );

  const imageMimeType = /image\/(png|jpg|jpeg)/i;

  useEffect(() => {
    let fileReader,
      isCancel = false;

    if (image) {
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setImageUrl(result);
        }
      };

      fileReader.readAsDataURL(image);
    }
  }, [image]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNumber) {
      return toast.error("Please fill all form fields...");
    }

    let formData = new FormData();

    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("profile_image", imageUrl);

    await mutate(formData);
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

  if (prLoading) {
    return (
      <div className="sm:mx-6 mt-6 lg:mx-auto lg:w-[90%]">
        <SkeletonLoaders count={5} />
      </div>
    );
  }

  return (
    <div className="h-full sm:mx-6 mt-6 lg:mx-auto lg:w-[90%]">
      <div className="flex flex-col lg:flex-row gap-6 mt-6 text-sm">
        <div className="mx-auto">
          <img
            src={imageUrl}
            alt="avatar img"
            className="h-44 w-44 rounded-full bg-green-500"
          />

          <p
            onClick={handlePhotoClick}
            className="flex cursor-pointer justify-center items-center py-3"
          >
            <input
              type="file"
              name=""
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

        <form action="" onSubmit={handleSubmit} className="flex-1 lg:pr-16">
          <FormInput
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="first name"
            label="First name"
          />
          <FormInput
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="last name"
            label="Last name"
          />
          <FormInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            label="Email"
          />
          <FormInput
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 81674***"
            value={phoneNumber}
            label="Contact number"
          />

          <button
            disabled={mtPending}
            type="submit"
            value="Update"
            className={`w-full mt-4 text-white grid place-items-center p-3 rounded bg-oaksgreen cursor-pointer`}
          >
            {prLoading ? (
              <Rings
                height="30"
                width="30"
                color="#ffffff"
                radius="6"
                wrapperStyle={{ backgoundColor: "yellow" }}
                wrapperClass=""
                visible={true}
                ariaLabel="rings-loading"
              />
            ) : (
              "update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
