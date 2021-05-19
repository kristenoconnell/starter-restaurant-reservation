import React from "react";

//map the list of resos into cards

function ReservationList({ reservations }) {

    if (reservations.length > 0) {
        return (
            <div className="container">
                <div className="card-list">
                {reservations.map((reservation, index) => (
                    <div className="card" key={index}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-7">
                                    <h3 className="card-title">{reservation.first_name} {reservation.last_name}</h3>
                                </div>
                                <div className="col-5">
                                    {reservation.reservation_time}
                                </div>
                            </div>
                                <div className="row">
                                    <div className="col-7">
                                        <p class="text-muted">
                                            {reservation.people}
                                        </p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-7">
                                        {reservation.mobile_number}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    else return "No reservations for this date yet!";
}

export default ReservationList;