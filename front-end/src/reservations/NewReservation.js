import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import useQuery from "../utils/useQuery";

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
        let value = target.value;
        setFormData({
            ...formData,
            [target.name]: value
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        async function newReservation() {
            try {
                await createReservation(formData, abortController.signal);
                history.push("/dashboard");
                //history.push(`/dashboard/?date=${date}`);
            } catch (error) {
                throw error;
            }

        }
        newReservation();
        return () => abortController.abort;
    };

    return (
        <div class="container mx-auto" style={{width: 400}}>
            <h1>New Reservation</h1>
            <form onSubmit={handleSubmit}>
                <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                <br />
                <br />
                <button onClick={() => history.goBack()}>Cancel</button>
                <button type="submit">Submit</button>
            </form>

        </div>
    )
}

export default NewReservation;