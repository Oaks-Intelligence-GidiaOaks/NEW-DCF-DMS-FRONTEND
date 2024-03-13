import React from "react";
import right from "../../assets/icons/right.svg";
import user from "../../assets/icons/user.svg";

import SidebarItem from "./SidebarItem";
import RecentActivity from "../RecentActivity";
import { NavLink } from "react-router-dom";
import { useApp, useAuth } from "../../context";
import {
  Home,
  FilterNone,
  Groups,
  OpenWith,
  Logout,
} from "@mui/icons-material";
import LogoutButton from "../LogoutButton";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import { MdOutlineCollectionsBookmark } from "react-icons/md";

const SuperAdminSidebar = () => {
  // const { user } = useAuth();
  const { setCurrentPage, sidebarShown, setSidebarShown } = useApp();

  const activeStyle = "bg-gray-200 p-3 mt-3";
  const nonActiveStyle = "p-3 mt-3";

  const handleNavLinkClick = () => {
    if (sidebarShown) {
      setSidebarShown(false);
    }
    setCurrentPage("profile");
  };

  return (
    <div
      className={`w-72 xs:absolute md:static top-0 left-0 ${
        sidebarShown ? "xs:initial" : "xs:hidden"
      } sm:block left-0 z-30 lg:shrink-0 h-full text-sm bg-white`}
    >
      <div className="ml-10 flex flex-col h-full">
        <p className="mt-2 capitalize p-1 px-2 text-white bg-oaksgreen w-fit flex items-center gap-2 rounded">
          {/* {user?.role === "admin" ? <MdAdminPanelSettings /> : <FaCrown />} */}
          {/* {user.role.replace("_", " ")} */}
        </p>

        <NavLink
          className={({ isActive }) =>
            isActive ? activeStyle : nonActiveStyle
          }
          onClick={handleNavLinkClick}
          to="/super_admin/profile"
        >
          <div className="flex items-start ">
            <img
              src={
                // user.avatar.url ||
                `https://res.cloudinary.com/emmaotuonye1/image/upload/v1686759696/avatars/Avatar-2_lmptpe.png`
              }
              alt="avatar"
              className="h-10 w-10 border rounded-full mr-auto"
            />

            <div className="text-[12px] p-1">
              <p className="text-[16px]">
                {/* {user.firstName + " " + user.lastName} */}
                Emmanuel Otu
              </p>
              <span>7654689</span>
            </div>

            <img src={right} alt="" className="ml-auto p-2 rounded" />
          </div>
        </NavLink>

        {/* nav links */}
        <div className="mt-8 space-y-2">
          <SidebarItem
            Icon={Home}
            key="1"
            text="Home"
            active
            link="super_admin/home"
          />
          <SidebarItem
            key="2"
            text="Sub Admins"
            Icon={Groups}
            link="super_admin/admins"
          />
          <SidebarItem
            key="3"
            text="Form responses"
            Icon={FilterNone}
            link="super_admin/responses"
          />
          <SidebarItem
            key="4"
            text="Response tracker"
            Icon={OpenWith}
            link="super_admin/tracker"
          />
          <SidebarItem
            key="5"
            text="Master list"
            Icon={OpenWith}
            link="super_admin/master"
          />
          <SidebarItem
            key="6"
            text="Configuration"
            Icon={MdOutlineCollectionsBookmark}
            link="super_admin/configuration"
          />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
