import { BadgePlus, ShieldPlus } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { motion } from "framer-motion";

const NewWarehouse = ({ warehouses, onWarehouseCreated }) => {
  const [isNewWarehouseModalOpen, setIsNewWarehouseModalOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    code: "",
    location: "",
    branch: "",
  });
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const modalRef = document.getElementById("modal");

      if (modalRef && !modalRef.contains(event.target)) {
        closeModal();
      }
    };

    if (isNewWarehouseModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNewWarehouseModalOpen]);

  const openModal = () => {
    setIsNewWarehouseModalOpen(true);
    setIsButtonClicked(true);
  };

  const closeModal = () => {
    setNewWarehouse({
      name: "",
      code: "",
      location: "",
      branch: "",
    });
    setIsNewWarehouseModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWarehouse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission

    const existingWarehouse = warehouses.find(
      (warehouse) => warehouse.code === newWarehouse.code
    );

    if (existingWarehouse) {
      toast.error("The Warehouse code already exists.", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    } else {
      closeModal();
      onWarehouseCreated(newWarehouse);

      // Show a success toast when a new vessel is created
      toast.success("New Warehouse created successfully!", {
        position: toast.POSITION.TOP_RIGHT,
        style: {
          background: "#8acaff", // Background color
          color: "#ffffff", // Text color
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1)", // Box shadow
          borderRadius: "12px 0  12px 0",
          width: "96%",
          fontSize: "bold",
        },
      });
    }
  };

  return (
    <div>
      {isNewWarehouseModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70"
        >
          <motion.div
            id="modal"
            ref={modalRef}
            className="bg-white p-4 rounded-3xl grid transition duration-500"
            initial={{ scale: 0, x: "-0%" }} // Initial position from left
            animate={{ scale: 1, x: 0 }} // Animate to the center
            exit={{ scale: 0, y: "0%" }} // Exit to the left
            transition={{ duration: 0.05, ease: "easeInOut" }} // Custom transition
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold mb-4 drop-shadow-md">
                New Warehouse
              </h2>
              <ShieldPlus className="shadow-xl text-sky-400 " />
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="grid ">
                <span className=" text-sm drop-shadow-lg mb-1 text-sky-500 mr-2">
                  Warehouse Name
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="name"
                  value={newWarehouse.name}
                  onChange={handleInputChange}
                  placeholder="name"
                  required
                />
              </div>

              <div className="grid">
                <span className="text-sm drop-shadow-lg mb-1 text-sky-500 mr-2">
                  Warehouse Code
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="string"
                  name="code"
                  value={newWarehouse.code}
                  onChange={handleInputChange}
                  placeholder="Code"
                  required
                />
              </div>
              <div className="grid">
                <span className="text-sm drop-shadow-lg mb-1 text-sky-500 mr-2 flex">
                  Location (Latitude, Longitude)
                </span>
                <input
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 shadow-md focus:shadow-xl focus:scale-105 transition-all duration-500 outline-none"
                  type="text"
                  name="location"
                  value={newWarehouse.location}
                  onChange={handleInputChange}
                  placeholder="Latitude, Longitude"
                  required
                />
              </div>
              <div className="grid">
                <span className="text-sm drop-shadow-lg mb-1 text-sky-500">
                  Branch
                </span>

                <select
                  className="px-2 py-1 border border-gray-300 rounded-lg mb-2 text-muted-foreground shadow-md focus:scale-105 outline-none"
                  name="branch"
                  value={newWarehouse.branch}
                  onChange={handleInputChange}
                >
                  <option value="">Branch</option>
                  <option value="Damietta">Damietta</option>
                  <option value="El-Dekheila">El-Dekheila</option>
                  <option value="Abu Qir">Abu Qir</option>
                  <option value="El-Adabia">El-Adabia</option>
                  <option value="PortSaid">PortSaid</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  className={`px-4 py-1 bg-sky-400 text-white rounded-lg mr-2 shadow-md ${
                    isButtonClicked
                      ? "hover:bg-sky-500 hover:scale-95"
                      : "hover:scale-95"
                  }`}
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="px-2 py-1 bg-gray-300 rounded-lg shadow-md hover:scale-95"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <button
        className={`lg:mr-16 px-2 py-1 bg-sky-400 text-white rounded-lg shadow-md ${
          isButtonClicked
            ? "hover:bg-sky-400"
            : "hover:scale-[95%] hover:bg-sky-500"
        } transition`}
        onClick={openModal}
      >
        New Warehouse
        <span className="text-xl"> +</span>
      </button>

      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default NewWarehouse;
