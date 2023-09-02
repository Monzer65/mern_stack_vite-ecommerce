/** @format */

import { useState, useEffect } from "react";
import axios from "axios";

function LocationInfo() {
  const [location, setLocation] = useState({});

  useEffect(() => {
    async function fetchLocation() {
      try {
        const response = await axios.get(
          "http://ipinfo.io?token=19567bb6485662"
        );
        setLocation(response.data);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    }

    fetchLocation();
  }, []);

  return (
    <div className="deliver-to">
      <p>Deliver to:</p>
      <span>{location.country} </span>
      <span> {location.city}</span>
    </div>
  );
}

export default LocationInfo;
