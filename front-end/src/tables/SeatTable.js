import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { table } from "../../../back-end/src/db/connection";
import { listTables } from "../utils/api";
import SelectTable from "./SelectTable";

function SeatTable() {
  const [tables, setTables] = useState([]);
  const [tableErrors, setTableErrors] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [formData, setFormData] = useState({});
  const { reservationId } = useParams();
  const abortController = new AbortController();
  const history = useHistory();

    function loadTables() {
       listTables(abortController.signal)
         .then(setTables)
         .then(() => readReservation(reservationId))
         .then(setReservation)
         .catch((tableErrors) => setTableErrors);
       return () => abortController.abort(); 
  }

  useEffect(loadTables, [reservation]);

  //define change handler
  const handleChange = async ({ target }) => {
    setFormData = {
      ...formData,
      [target.name]: target.value,
    };
  };
;

  //define submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    //option.table.reservation_id = reservationId;
    //table.status=

    //on submit
    //const table.reservation_id = reservationId;
    //table.status = "Occupied";
    //return to dashboard;
  };;

  //define initial form state??


  return (
    <div className="container">
          <div className="row">
              <SelectTable tables={tables} reservation={reservation} handleChange={handleChange} handleSubmit={handleSubmit} />
            </div> 
      </div>
  );
}

export default SeatTable;
