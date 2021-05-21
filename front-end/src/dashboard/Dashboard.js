import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listByDate } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ReservationList from "../reservations/ReservationList";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, setDate }) {
  const query = useQuery();
  if (query.get("date")) {
    date = query.get("date")
  }
  console.log("date", date)

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadDashboard() {
    const res_date = date;
    const abortController = new AbortController();
    setReservationsError(null);
    listByDate(res_date, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    console.log("reservations", reservations)
    return () => abortController.abort();
  }

   useEffect(loadDashboard, [date, reservations]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="row">
        <Link to={`/dashboard/?date=${previous(date)}`} className="btn btn-dark">
          Previous
        </Link>
        &nbsp;
        <Link to={`/dashboard`} className="btn btn-light">
          Today
        </Link>
        &nbsp;
        <Link to={`/dashboard/?date=${next(date)}`} className="btn btn-dark">
          Next
        </Link>
      </div>
      <div className="row">
        <ReservationList reservations={reservations} />
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}
//  {JSON.stringify(reservations)}

export default Dashboard;
