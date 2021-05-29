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
    setFormData({
      table_name: value,
    });
  };


  //define submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const resId = reservation.reservation_id;
    let tableName = formData.table_name
    const foundTable = tables.find((table) => table.table_name === tableName);
    setTable(() => foundTable);

    try {
      const seated = await seatTable(foundTable.table_id, resId);
      seated.status = "Occupied";
      history.push("/");
    } catch (error) {
      throw error;
    }
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
}

export default SeatReservation;
