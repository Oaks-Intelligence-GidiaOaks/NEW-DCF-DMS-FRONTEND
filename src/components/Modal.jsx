// src/components/Modal.js

import React from "react";
import { useNavigate } from "react-router-dom";

const InfoModal = ({ show, onClose, title, children }) => {
  const navigate = useNavigate();
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white p-5 rounded-lg shadow-lg w-[clamp(240px,90vw,343px)]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{children}</p>
          </div>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-primary-green text-white text-base font-medium rounded w-full shadow-sm hover:bg-primary-green hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
              onClick={() => {
                onClose();
                navigate("/");
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
