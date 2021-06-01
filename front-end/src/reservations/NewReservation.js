import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";
import ValidateReservation from "./ValidateReservation";
import Errors from "../errors/Errors";

function NewReservation() {

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "1",
        status: "booked"
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const handleChange = ({ target }) => {

        setFormData({
            ...formData,
            [target.name]: target.value
        });
    }


    const handleSubmit = async (event) => {
        event.preventDefault();
        const abortController = new AbortController();
        const foundErrors = ValidateReservation(formData);
        if (foundErrors.length) {
            setErrors(foundErrors);
        } else {
            try {
                const newRes = await createReservation(formData,  abortController.signal );
                history.push(`/dashboard/?date=${newRes.reservation_date.slice(0, 10)}`);
            } catch (error) {
                if (error === !"AbortError") {
                    setErrors([error]);
                }
            }
            return () => abortController.abort();
        }
    };

    return (
      <div className="container mx-auto" style={{ width: 400 }}>
            <h1>New Reservation</h1>
            <div>
                {errors.length > 0 &&
                    <Errors errors={errors} />
                }
                <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                <br />
                <br />
            </div>
      </div>
    );
}

export default NewReservation;