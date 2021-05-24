import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { listByDate, listTables } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ReservationList from "../reservations/ReservationList";
import TablesList from "../tables/TablesList";
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
  //console.log("date", date)

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableErrors, setTableErrors] = useState(null);

  function loadDashboard() {
    const res_date = date;
    const abortController = new AbortController();
    setReservationsError(null);
    listByDate(res_date, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    setTableErrors(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch((errors) => setTableErrors);
    
    //console.log("reservations", reservations)
    //console.log("tables", tables)
    return () => abortController.abort();
  }

   useEffect(loadDashboard, [date]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <div className="row mx-2">
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
      <br />
      <div className="row">
        <div className="col-6">
          <ReservationList reservations={reservations} tables={tables} tableErrors={tableErrors} />
        </div>
        <div className="col-6">
          <TablesList tables={tables} reservations={reservations} tableErrors={tableErrors} />
        </div>
      </div>
      <ErrorAlert error={reservationsError}  />
    </main>
  );
}
//  {JSON.stringify(reservations)}

export default Dashboard;
