import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { changeResStatus, readReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {

    const { reservationId } = useParams();
    const [reservation, setReservation] = useState({});
    const history = useHistory();

    const handleChange = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.value
        })
    };

    const handleCancel = async (event) => {
        const confirm = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
        if (confirm) {
            try {
                const status = "cancelled"
                const updated = await changeResStatus(reservation.reservation_id, reservation.status);
                console.log("updated res handle cancel", reservation);
            } catch (error) {
                throw error;
            }
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("submit event", event);
        history.push("/")
    }

    //load reservaton 
    useEffect(() => {
        const loadReservation = async () => setReservation(await readReservation(reservationId));
        loadReservation();
        console.log("set reservation edit res comp", reservation);
    }, [reservationId]);
    

    return (
        <ReservationForm handleChange={handleChange} handleCancel={handleCancel} handleSubmit={handleSubmit} />
    )

}

export default EditReservation;