import React, { useState, useEffect } from "react";
import { useParams, useHistory, Switch, Route, Redirect } from "react-router-dom";
import { listTables, readReservation, seatTable, readTable } from "../utils/api";
import SelectTable from "./SelectTable";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {

  const [tables, setTables] = useState([]);
  const [table, setTable] = useState({});
  const [tableErrors, setTableErrors] = useState(null);
  const [reservation, setReservation] = useState({});
  const [formData, setFormData] = useState({});
  const { reservationId } = useParams();
  const abortController = new AbortController();
  const history = useHistory();

   
    useEffect(() => {
        const loadTables = async () => setTables(await listTables());
        loadTables();
        const loadRes = async () => setReservation(await readReservation(reservationId));
        loadRes();
    }, [reservationId]);

  //useEffect(loadSeat, [reservationId]);

  //define change handler
   const handleChange = async ({ target }) => {
     const value = target.selectedOptions[0].value;
     console.log("target", target.selectedOptions[0].value);
     setFormData({
       table_name: value,
     });
       console.log("form", formData);
   };


  //define submit handler
  const handleSubmit = async (event) => {
      event.preventDefault();
      let tableName = formData.table_name
      const table = tables.find((table) => table.table_name === tableName);
      setTable(table);
      const resId = reservation.reservation_id;
      await seatTable(table.table_id, resId)
        .then(() => listTables())
        .then(history.push("/"))
        .catch((error) => {
          throw error;
        });
    
      
      //return updated;
      //history.push("/");
      //PUT {data: { reservation_id: reservationId } } to /tables/:tableId/seat/ to save res id
  };


   if (tableErrors) {
        return (
            <ErrorAlert error={tableErrors} />
        )
    }
    else {
     return (
      <div>
        <div className="container">
            <div className="row">
                <SelectTable
                    tables={tables}
                    reservation={reservation}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
      </div>
         </div>
    );
}

  /*return (
    <div className="container">
          <div className="row">
              <SelectTable tables={tables} reservation={reservation} handleChange={handleChange} handleSubmit={handleSubmit} />
            </div> 
      </div>
  );*/
}

export default SeatReservation;
