import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listByDate } from "../utils/api";
import ReservationList from "../reservations/ReservationList";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  console.log(query.get("date"));
    date = query.get("date");
  

  /*const params = useParams();
  if (params.date) {
    date = params.date;
    console.log("date", date);
    console.log("params", params);
  } */

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const res_date = date;
    const abortController = new AbortController();
    setReservationsError(null);
    listByDate(res_date, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div>
        <ReservationList reservations={reservations} />
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}
//  {JSON.stringify(reservations)}

export default Dashboard;
