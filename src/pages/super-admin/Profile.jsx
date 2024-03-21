import React, { useEffect, useRef, useState } from "react";
import { EditNote } from "@mui/icons-material";
import { FormInput } from "../../components/form";
import { useAuth } from "../../context";
import axios from "axios";
import { Rings } from "react-loader-spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "../../lib/service";
import { toast } from "react-toastify";

const Profile = () => {
  // const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data: uData, isSuccess: uSuccess } = useQuery({
    queryKey: ["getMyProfile"],
    queryFn: getMyProfile,
  });

  let user = uData?.data.user;

  console.log("uData", uData);

  const {
    mutate,
    isLoading: isUserLoading,
    isSuccess: isUserSuccess,
    isError: isUserError,
  } = useMutation({
    mutationKey: ["updateMyProfile"],
    mutationFn: (userData) => updateMyProfile(userData),
    onSuccess: (sx) => {
      toast.success(`User Profile Updated Successfully`);
      queryClient.invalidateQueries({ queryKey: ["getUserProfile"] });
    },
    onError: (ex) => {
      toast.error(ex.message);
    },
  });

  const avaterRef = useRef(null);

  const [first_name, setFirstName] = useState(user?.first_name || "");
  const [last_name, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone_number, setPhoneNumber] = useState(user?.phone_number || 234);
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
    if (!first_name || !last_name || !email || !phone_number) {
      setError("Please fill all form fields...");
      return;
    }

    let formData = new FormData();

    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("phone_number", phone_number);
    formData.append("id", user.id);
    formData.append("photo_url", imageUrl);

    user.states.forEach((state) => formData.append("states", state));
    user.districts.forEach((lga) => formData.append("districts", lga));

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
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Maria"
            label="First name"
          />
          <FormInput
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Grey"
            label="Last name"
          />
          <FormInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mariagrey@demo.com"
            label="Email"
          />
          <FormInput
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+234 81674***"
            value={phone_number}
            label="Contact number"
          />

          <button
            type="submit"
            value="Update"
            className="w-full mt-4 text-white grid place-items-center p-3 rounded bg-oaksgreen cursor-pointer"
          >
            {isUserLoading ? (
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
