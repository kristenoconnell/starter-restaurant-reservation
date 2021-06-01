import React from "react";
import { Link } from "react-router-dom";

//map the list of resos into cards

function ReservationList({ reservations, updateStatus, handleCancel }) {

    if (reservations.length > 0) {
        return (
          <div className="container">
            <div className="card-list">
              {reservations.map((reservation, index) => (
                <div className="card" key={index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-7">
                        <h3 className="card-title">
                          {reservation.first_name} {reservation.last_name}
                        </h3>
                      </div>
                      <div className="col-5">
                        <button
                          data-reservation-id-cancel={
                            reservation.reservation_id
                          }
                          onClick={handleCancel}
                          value={reservation.reservation_id}
                          className="btn btn-outline-danger btn-sm mb-1"
                        >
                          Cancel
                        </button>
                        <br/>
                          {reservation.status === "booked" ? (
                            <>
              
                                <Link
                                  to={`/reservations/${reservation.reservation_id}/seat`}
                                >
                                  <button
                                    href={`/reservations/${reservation.reservation_id}/seat`}
                                    value={`${reservation.reservation_id}`}
                                    className="btn btn-outline-primary btn-sm mr-1"
                                  >
                                    Seat
                                  </button>
                                </Link>
                           
                                <Link
                                  to={`/reservations/${reservation.reservation_id}/edit`}
                                >
                                  <button
                                    className="btn btn-outline-dark btn-sm"
                                    href={`/reservations/${reservation.reservation_id}/edit`}
                                  >
                                    Edit
                                  </button>
                                </Link>
                  
                            </>
                          ) : (
                            ""
                          )}
                      </div>
                    </div>
                    

                    <div className="col-7">
                      Phone: {reservation.mobile_number}
                      <br />
                      Time: {reservation.reservation_time.slice(0, 5)}
                      <br />
                      Party size: {reservation.people}
                      <br />
                      <p
                        data-reservation-id-status={reservation.reservation_id}
                      >
                        Status: {reservation.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
    else return (
        <div className="px=2">
            No reservations for this date yet!
        </div>
    )
}
            
//include route for seat tables?

export default ReservationList;