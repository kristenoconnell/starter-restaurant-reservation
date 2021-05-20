import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
//import useQuery from "../utils/useQuery";

import ReservationForm from "./ReservationForm";

function NewReservation() {

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    };

    const [formData, setFormData] = useState({ ...initialFormState});
    const history = useHistory();
    //const query = useQuery();
    //const date = query.get("date");

    const handleChange = ({ target }) => {
        //let value = target.value;
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    }

      const handleSubmit = (event) => {
        event.preventDefault();

        async function newReservation() {
          try {
            const newRes = await createReservation(formData);
            history.push(`/dashboard/?date=${newRes.reservation_date}`);
          } catch (error) {
            if (error === !"AbortError") {
              throw error;
            }
          }
        }
        newReservation();
      };

    return (
      <div class="container mx-auto" style={{ width: 400 }}>
        <h1>New Reservation</h1>
        <div>
          <ReservationForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          <br />
          <br />
          <button onClick={() => history.goBack()}>Cancel</button>
          <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    );
}

export default NewReservation;