"use client";

// Import necessary modules and components
import React, { useState, useEffect } from "react";
import { Heading } from "@/components/heading";
import { CalendarDays, CheckSquare, ShieldX } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import UpdateBooking from "../components/booking-update";
import CloseBooking from "../components/booking-closed";


const BookingInfoPage = ({ params }) => {
  const [booking, setBooking] = useState(null);
  const [closedBookings, setClosedBookings] = useState([]);


  // Extract 'id' from params
  const { id } = params;

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("Bookings")) || [];
    const foundBooking = bookings.find((c) => c.id === id);

    if (foundBooking) {
      setBooking(foundBooking);
    }
  }, [id]);

  const handleUpdateBooking = (updatedBooking) => {
    // Update the booking in the state
    setBooking(updatedBooking);

    // Update the booking in the local storage
    const updatedBookings = JSON.parse(localStorage.getItem("Bookings")) || [];
    const bookingIndex = updatedBookings.findIndex(
      (booking) => booking.id === updatedBooking.id
    );

    if (bookingIndex !== -1) {
      updatedBookings[bookingIndex] = updatedBooking;
      localStorage.setItem("Bookings", JSON.stringify(updatedBookings));
    }
  };

  if (!booking) {
    return <div>Loading...</div>;
  }


  const handleBookingClosed = (closedBooking) => {
    setClosedBookings((prevClosedBookings) => [
      ...prevClosedBookings,
      closedBooking,
    ]);

    const updatedBooking = { ...closedBooking, status: "Closed" };
    handleUpdateBooking(updatedBooking);
  };

  return (
    <div>
      <Link href="/booking">
        <Heading
          title="Booking Management"
          description="Monitor all bookings in one place."
          icon={CalendarDays}
          iconColor="text-sky-400"
        />
      </Link>

      <div className="px-4 md:px-12 lg:px-32 space-y-4 grid  xl:grid-cols-2 gap-4">
        <Card className="p-4 border-black/5 flex flex-col mt-4 shadow-md hover:shadow-xl transition rounded-2xl ">
        <div className="  flex items-center justify-center mb-4 cursor-pointer ">
                <div className="w-full ">
                  <div className="flex text-lg  mb-2 bg-gray-100 shadow-xl p-2 items-center justify-center rounded-t-2xl font-semibold">
                    <div className="text-left ">Booking Number: </div>
                    <div className="flex ml-2 ">
                      {booking.bookingNumber || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Work Order:</div>
                    <div className="text-right ">
                      {booking.workOrder || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between mb-2 shadow-md p-2">
                    <div className="text-left text-sm">Vessel:</div>
                    <div className="text-right ">
                      {booking.vessel || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Cargo:</div>
                    <div className="text-right ">
                      {booking.cargo || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Sub Cargo:</div>
                    <div className="text-right ">
                      {booking.subCargo || "..........."}
                    </div>
                  </div>
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">IMEX:</div>
                    <div className="text-right ">
                      {booking.IMEX || "..........."}
                    </div>
                  </div>
                  {/* <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Number of Trucks:</div>
                    <div className="text-right ">
                      {booking.numberOfTrucks || "..........."}
                    </div>
                  </div> */}
                  <div className="flex justify-between shadow-md p-2">
                    <div className="text-left text-sm">Opened At:</div>
                    <div className="text-right text-sm ">
                      {new Date(booking.openedAt).toLocaleDateString()}{" "}
                      <br />
                      {new Date(booking.openedAt).toLocaleTimeString() ||
                        "............."}
                    </div>
                  </div>

                  <div className="flex justify-between shadow-md p-2 ">
                    <div className="text-left text-sm">Status:</div>
                    <div className="text-right ">
                      {booking.status === "Closed" ? (
                        <>
                          <span className="text-red-500 flex items-center justify-center font-semibold">
                          <ShieldX className="mr-1" />                            Closed
                          </span>
                          <div className="text-sm text-gray-500">
                            {new Date(booking.closedAt).toLocaleDateString()}{" "}
                            {new Date(booking.closedAt).toLocaleTimeString() ||
                              "............."}
                          </div>
                        </>
                      ) : (
                        <div className=" flex items-center mt-4 ">
                        <span className="text-green-500 font-semibold mr-1 ">
                          <CheckSquare />                        </span>
                        Open
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

          <div className="flex justify-center mt-2">
            <UpdateBooking
              booking={booking}
              onUpdateBooking={handleUpdateBooking}
            />
                  <CloseBooking
                booking={booking}
                onBookingClosed={handleBookingClosed}
              />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingInfoPage;
