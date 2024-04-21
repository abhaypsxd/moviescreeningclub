import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
const SERVERIP = "http://14.139.34.10:8000";

const SeatMapPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get("email");
  const showtimeId = location.pathname.split("/")[2];
  const movie = searchParams.get("movie");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const date1 = moment(date).format("DD-MM-YYYY");
  const time1 = moment(time, "HH:mm").format("hh:mm A");

  const [selectedSeat, setSelectedSeat] = useState(null);
  const [assignedSeat, setAssignedSeat] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [seatOccupancy, setSeatOccupancy] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    // If userType is not volunteer or admin, redirect to home page
    if (!userType) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch seat occupancy information when the component mounts
    const fetchSeatOccupancy = async () => {
      try {
        const response = await axios.get(`${SERVERIP}/seatmaprouter/seatmap/${showtimeId}/seats`);
        setSeatOccupancy(response.data);
        console.log(movie);
        console.log(date1);
        console.log(time1);
        
      } catch (error) {
        console.error("Error fetching seat occupancy:", error);
      }
    };

    fetchSeatOccupancy();
  }, [showtimeId]);

  const seatAssignment = localStorage.getItem("seatassignment");
  useEffect(() => {
    if (seatAssignment === "false") {
      setTimeout(() => {
        window.location.href = "/scanner";
      }, 0);
    }
  }, [showtimeId]);
  

  const handleSeatSelection = (seat) => {
    if (assignedSeat || seatOccupancy[seat]) {
      setErrorMessage("This seat is already occupied. Please select another seat.");
      return;
    }
    setSelectedSeat(seat);
    setErrorMessage(null);
  };

  const handleConfirmSeat = async () => {
    try {
      await axios.put(`${SERVERIP}/seatmaprouter/seatmap/${showtimeId}/${selectedSeat}`, { email });
      setAssignedSeat(true);
        const emailContent = {
          email,
          selectedSeat,
          movie,
          date1,
          time1
        };
        axios
          .post(`${SERVERIP}/seatmaprouter/send-email`, emailContent)
            console.log(`Email sent for seat assignment.`);
      
      setErrorMessage(`The seat ${selectedSeat} is successfully assigned to ${email}. Redirecting to Scanner...`);
      localStorage.setItem("seatassignment", "false");
      setTimeout(() => {
        window.location.href = "/scanner";
      }, 5000);
    } catch (error) {
      console.error("Error assigning seat:", error);
      if (error.response && error.response.status === 400) {
        setErrorMessage(`Seat ${selectedSeat} is already occupied`);
      } else {
        setErrorMessage("An error occurred while assigning the seat");
      }
    }
  };

  return (
    <div className="seat-booking">
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!assignedSeat && (
        <div>
          <h1 className="text-3xl font-semibold mb-4">Movie Theatre Seat Booking</h1>
          <div className="flex justify-center mb-4">
            <span className="font-semibold text-lg" style={{ marginBottom: '20px' }}>Screen</span>
          </div>
          <svg
            className="w-3/4 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 10"
          >
            <path
              d="M0 5 C 25 -2, 75 -2, 100 5"
              fill="none"
              stroke="black"
              strokeWidth="0.3"
            />
          </svg>
          <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-2">
              {[...Array(9).keys()].map(row => (
                <div key={row} className="flex gap-2">
                  {[...Array(6).keys()].map(col => {
                    const seatNumber = row * 6 + col + 1;
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                      >
                        <span className="block w-4 h-5">{seatNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2">
              {[...Array(10).keys()].map(row => (
                <div key={row} className="flex gap-2">
                  {[...Array(12).keys()].map(col => {
                    const seatNumber = 54 + row * 12 + col + 1;
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                      >
                        <span className="block w-4 h-5">{seatNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2">
              {/* Container for the 5x5 block */}
              <div style={{ marginTop: '50px' }}>
                {[...Array(9).keys()].map(row => (
                  <div key={row} className="flex gap-2">
                    {[...Array(6).keys()].map(col => {
                      const seatNumber = 174 + row * 6 + col + 1;
                      return (
                        <div
                          key={col}
                          className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                          disabled={assignedSeat || seatOccupancy[seatNumber]}
                          style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                        >
                          <span className="block w-4 h-5">{seatNumber}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mb-8"></div> {/* Vertical spacing */}
          <div className="flex justify-center mt-4 mb-4">
            <span className="font-semibold text-lg">Entrance</span>
          </div>
          <div className="flex justify-between gap-4">
            <div className="flex flex-col gap-2">
              {[...Array(7).keys()].map(row => (
                <div key={row} className="flex gap-2">
                  {[...Array(7).keys()].map(col => {
                    const seatNumber = 228 + row * 7 + col + 1;
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                      >
                        <span className="block w-4 h-5">{seatNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2" style={{ marginTop: '90px' }}>
              {[...Array(5).keys()].map(row => (
                <div key={row} className="flex gap-2">
                  {[...Array(5).keys()].map(col => {
                    const seatNumber = 277 + row * 5 + col + 1;
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                      >
                        <span className="block w-4 h-5">{seatNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="w-4"></div> {/* Entrance space */}
            <div className="flex flex-col gap-2">
              {[...Array(7).keys()].map(row => (
                <div key={row} className="flex gap-2">
                  {[...Array(7).keys()].map(col => {
                    const seatNumber = 332 + row * 7 + col + 1;
                    return (
                      <div
                        key={col}
                        className={`seat bg-white-50 border border-gray-400 p-2 text-center cursor-pointer font-roboto text-10 ${selectedSeat === seatNumber ? 'bg-green-600' : seatOccupancy[seatNumber] ? 'bg-gray-200' : ''}`}
                        onClick={() => handleSeatSelection(seatNumber)}
                        disabled={assignedSeat || seatOccupancy[seatNumber]}
                        style={{ color: seatOccupancy[seatNumber] ? "red" : "black" }}
                      >
                        <span className="block w-4 h-5">{seatNumber}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {selectedSeat && (
            <div>
              <p>Selected Seat: {selectedSeat}</p>
              <button onClick={handleConfirmSeat}>Confirm Seat</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeatMapPage;
