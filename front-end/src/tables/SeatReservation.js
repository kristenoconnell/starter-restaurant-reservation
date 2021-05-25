import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, readReservation, seatTable } from "../utils/api";
import SelectTable from "./SelectTable";
import Errors from "../errors/Errors";

function SeatReservation() {

  const [tables, setTables] = useState([]);
  const [table, setTable] = useState({});
  const [tableErrors, setTableErrors] = useState(null);
  const [reservation, setReservation] = useState({});
  const [formData, setFormData] = useState({});
  const { reservationId } = useParams();
  //const abortController = new AbortController();
  const history = useHistory();

   
    useEffect(() => {
        const loadTables = async () => setTables(await listTables());
        loadTables();
        const loadRes = async () => setReservation(await readReservation(reservationId));
        loadRes();
    }, [reservationId]);


  //define change handler
   const handleChange = async ({ target }) => {
     const value = target.selectedOptions[0].value;
     //console.log("target", target.selectedOptions[0].value);
     setFormData({
       table_name: value,
     });
       //console.log("form", formData);
   };


  //define submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resId = reservation.reservation_id;
      let tableName = formData.table_name
    const foundTable = tables.find((table) => table.table_name === tableName);
    console.log("foundTable", foundTable);
      setTable(() => foundTable);
    console.log("submitSeatRes table", table);
    await seatTable(foundTable.table_id, resId)
        .then((response) => console.log("res", response))
        .then(history.push("/"))
        .catch((error) => {
          console.log(error);
          throw error;
        });
    //table is not making it into this function ^ and can't be passed to the api call so the param is returning undefined so it can't fetch and load the response bc it cant find the response so it gets stuck in the promise
    
      
      //return updated;
      //history.push("/");
      //PUT {data: { reservation_id: reservationId } } to /tables/:tableId/seat/ to save res id
  };


   if (tableErrors) {
        return (
            <Errors errors={tableErrors} />
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
