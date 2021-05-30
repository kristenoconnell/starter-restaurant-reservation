import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listByDate,
  listTables,
  deleteTableAssignment,
  changeResStatus
} from "../utils/api";
import { previous, next } from "../utils/date-time";
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
function Dashboard({ date }) {
  const query = useQuery();
  if (query.get("date")) {
    date = query.get("date")
  }

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
      .catch(setTableErrors);
    
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [date]);
  
  const handleFinish = async ({ target }) => {
    const confirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (confirm) {
      try {
        await deleteTableAssignment(target.value);
        loadDashboard();
      } catch (error) {
        setTableErrors([error]);
      }
    }
  };

   const handleCancel = async (event) => {
     const confirm = window.confirm(
       "Do you want to cancel this reservation? This cannot be undone."
     );
     if (confirm) {
         const reservation_id = event.target.value;
         console.log("handle change", reservation_id);
          const changed = await changeResStatus(
           reservation_id,
           "cancelled"
         );
        loadDashboard();
     }
   };

  const updateStatus = async ({ target }) => {
    const reservation_id = target.value;
    console.log("update status id", reservation_id);
    await changeResStatus(reservation_id, "seated")
    loadDashboard();
  }

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
          <ReservationList reservations={reservations} updateStatus={updateStatus} handleCancel={handleCancel} />
        </div>
        <div className="col-6">
          <TablesList tables={tables} handleFinish={handleFinish} reservations={reservations} tableErrors={tableErrors} />
        </div>
      </div>
      <ErrorAlert error={reservationsError}  />
    </main>
  );
}
//  {JSON.stringify(reservations)}

export default Dashboard;
