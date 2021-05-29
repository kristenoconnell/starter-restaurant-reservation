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
                        {reservation.reservation_time.slice(0, 5)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-7">
                        <p className="text-muted">
                          {reservation.mobile_number}
                        </p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-7 text-muted">
                        Party size: {reservation.people}
                      </div>
                      <div
                        className="col-5"
                        data-reservation-id-status={reservation.reservation_id}
                      >
                        Status: {reservation.status}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-7">
                        {reservation.status === "booked" ? (
                          <Link
                            to={`/reservations/${reservation.reservation_id}/seat`}
                          >
                            <button
                              href={`/reservations/${reservation.reservation_id}/seat`}
                              value={`${reservation.reservation_id}`}
                              onClick={updateStatus}
                            >
                              Seat
                            </button>
                          </Link>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="col-5">
                        <Link to={`/reservations/${reservation.reservation_id}/edit`}><button
                          className="mr-1"
                          href={`/reservations/${reservation.reservation_id}/edit`}
                        >
                          Edit
                        </button>
                          </Link>
                        <button
                          data-reservation-id-cancel={
                            reservation.reservation_id
                          } onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
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