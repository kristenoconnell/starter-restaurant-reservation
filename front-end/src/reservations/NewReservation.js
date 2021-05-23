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
        people: 1
    };

    const [formData, setFormData] = useState({ ...initialFormState});
    const history = useHistory();

    const handleChange = ({ target }) => {
        //let value = target.value;
        console.log("form", formData);

        setFormData({
            ...formData,
            [target.name]: target.value
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("event", event)
        try {
            const newRes = await createReservation(formData);
            history.push(`/dashboard/?date=${newRes.reservation_date.slice(0,10)}`);
        } catch (error) {
            if (error === !"AbortError") {
                throw error;
            }
        }
    };

    return (
      <div className="container mx-auto" style={{ width: 400 }}>
            <h1>New Reservation</h1>
            <div>
                <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                <br />
                <br />
            </div>
      </div>
    );
}

export default NewReservation;