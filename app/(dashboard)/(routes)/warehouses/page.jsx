"use client";

import React, { useEffect, useState } from "react";
import { Combine } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/heading";
import Pagination from "@/components/pagination";
import SortOptions from "./components/warehouse-sort";
import NewWarehouse from "./components/warehouse-new";
import UpdateWarehouse from "./components/warehouse-update";
import Filters from "@/components/filteration";

export default function WarehousePage() {
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const warehousesPerPage = 18;
  const [sortOption, setSortOption] = useState("");
  const [originalWarehouses, setOriginalWarehouses] = useState([]);

  useEffect(() => {
    const storedWarehouses =
      JSON.parse(localStorage.getItem("warehouses")) || [];
    setOriginalWarehouses(storedWarehouses.map(addSubsCount));
    setFilteredWarehouses(storedWarehouses.map(addSubsCount));
  }, []);

  // useEffect(() => {
  //   const storedWarehouses =
  //     JSON.parse(localStorage.getItem("warehouses")) || [];
  //   const updatedWarehouses = storedWarehouses.map(addSubsCount);
  //   setFilteredWarehouses(updatedWarehouses);
  // }, []);

  const addSubsCount = (warehouse) => {
    const warehouseSubs =
      JSON.parse(localStorage.getItem(`subs_${warehouse.id}`)) || [];
    warehouse.subs = warehouseSubs.length;
    return warehouse;
  };

  const filterWarehouses = (filterValue) => {
    if (filterValue === "") {
      setFilteredWarehouses(originalWarehouses);
      setCurrentPage(1);
    } else {
      const lowerCaseFilterValue = filterValue.toLowerCase();
      const filtered = originalWarehouses.filter((warehouse) => {
        return (
          warehouse.name.toLowerCase().includes(lowerCaseFilterValue) ||
          warehouse.code.toLowerCase().includes(lowerCaseFilterValue) |
          warehouse.branch.toLowerCase().includes(lowerCaseFilterValue) ||
          warehouse.location.toLowerCase().includes(lowerCaseFilterValue)
        );
      });

      setFilteredWarehouses(filtered);
      setCurrentPage(1);
    }
  };

  const sortWarehouses = (option) => {
    let sortedWarehouses = [...filteredWarehouses];

    switch (option) {
      case "name":
        sortedWarehouses.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "code":
        sortedWarehouses.sort((a, b) => a.code.localeCompare(b.code));
        break;
      case "branch":
        sortedWarehouses.sort((a, b) => a.branch.localeCompare(b.branch));
        break;
      case "location":
        sortedWarehouses.sort((a, b) => a.location.localeCompare(b.location));
        break;
      default:
        // No sorting
        break;
    }

    setFilteredWarehouses(sortedWarehouses);
  };

  const handleSortChange = (sortValue) => {
    setSortOption(sortValue);
    sortWarehouses(sortValue);
  };

  const handleWarehouseCreated = (newWarehouse) => {
    newWarehouse.id = uuidv4();
    newWarehouse.subs = 0;

    const updatedWarehouses = [...filteredWarehouses, newWarehouse];
    setFilteredWarehouses(updatedWarehouses);
    setOriginalWarehouses(updatedWarehouses);
    localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
  };

  const handleUpdateWarehouse = (updatedWarehouse) => {
    const warehouseIndex = filteredWarehouses.findIndex(
      (warehouse) => warehouse.id === updatedWarehouse.id
    );

    if (warehouseIndex !== -1) {
      const updatedWarehouses = [...filteredWarehouses];
      updatedWarehouses[warehouseIndex] = updatedWarehouse;
      setFilteredWarehouses(updatedWarehouses);
      setOriginalWarehouses(updatedWarehouses);
      localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
    }
  };

  // const handleDeleteWarehouse = (warehouse) => {
  //   const updatedWarehouses = filteredWarehouses.filter(
  //     (q) => q.id !== warehouse.id
  //   );
  //   setFilteredWarehouses(updatedWarehouses);
  //   setOriginalWarehouses(updatedWarehouses);
  //   localStorage.setItem("warehouses", JSON.stringify(updatedWarehouses));
  // };

  const indexOfLastWarehouse = currentPage * warehousesPerPage;
  const indexOfFirstWarehouse = indexOfLastWarehouse - warehousesPerPage;
  const currentWarehouses = filteredWarehouses.slice(
    indexOfFirstWarehouse,
    indexOfLastWarehouse
  );
  const totalPages = Math.ceil(filteredWarehouses.length / warehousesPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="">
      <Heading
        title="Warehouse Logistics"
        description="Streamlining Warehouse Movement."
        icon={Combine}
        iconColor="text-sky-400"
      />

      <div className="px-1 flex flex-col md:flex-row mt-8 mb-2 justify-center items-center ">
        <div className="flex-1 mb-4 ">
          <Filters onFilterChange={filterWarehouses} />
        </div>
        <div className="mb-4 ml-2">
          <SortOptions
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
        <div className="mb-4 ">
          <NewWarehouse
            warehouses={filteredWarehouses}
            onWarehouseCreated={handleWarehouseCreated}
          />
        </div>
      </div>

      <div className=" px-4 md:px-8 mt-4 lg:px-16  grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">

        {currentWarehouses.map((warehouse, index) => (
          <Card
          key={warehouse.id} // Make sure to use a unique key for each card
          className="w-1/2 p-4 border-black/5 flex flex-col shadow-md hover:shadow-xl transition rounded-2xl"
          >
          
          <div className="  flex items-center justify-end mb-4 ">
              <div className="w-full font- ">
            
              <div
                  className="flex text-lg  mb-2 bg-gray-100 shadow-lg p-2 items-center justify-center rounded-t-2xl font-semibold">
                  <div className="text-right ">
                    {warehouse.name || ".................."}
                  </div>
                </div>
                <div className="flex justify-between mb-2 shadow-md p-2">
                  <div className="text-left text-md">
                    code:
                  </div>
                  <div className="text-right ">
                    {warehouse.code || ".................."}
                  </div>
                </div>
                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">location:</div>
                  <div className="text-right ">
                    {warehouse.location || ".................."}
                  </div>
                </div>

                <div className="flex justify-between shadow-md p-2">
                  <div className="text-left text-md">
                     Branch:
                  </div>
                  <div className="text-right ">
                    {warehouse.branch || ".................."}
                  </div>
                </div>
              </div>
            </div>

          {/* <div className="flex flex-col items-center justify-end mb-4 p-2 shadow-md rounded-full ">
            <div className="text-center font-semibold text-xl">{warehouse.name}</div>
            <div className=" font-light text-center text-md">
              Code: {warehouse.code}
            </div>
          </div>
    
          <div className="flex flex-col">
            <span>Location: {warehouse.location}</span>
            <span>Branch: {warehouse.branch}</span>
          </div> */}
    
          <div className="flex justify-center ">
            <UpdateWarehouse
              warehouse={warehouse}
              onUpdateWarehouse={handleUpdateWarehouse}
            />
          </div>
        </Card>
        ))}
      </div>

      <Pagination
        currentUsers={currentWarehouses}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        />
    </div>
  );
}
