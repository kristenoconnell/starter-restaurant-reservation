import React, { useState } from "react";
import { searchByNumber } from "../utils/api";
import ReservationList from "../reservations/ReservationList";
import Errors from "../errors/Errors";


function Search() {
    const initialFormState = {
        mobile_number: ""
    }

    const [formData, setFormData] = useState({ ...initialFormState });
    const [reservations, setReservations] = useState([]);
    const [errors, setErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const mobile_number = formData.mobile_number;
            const foundReservations = await searchByNumber(mobile_number)
            setReservations(foundReservations);
            setSubmitted(true);
        } catch (error) {
            setErrors(error)
        }
    }

        return (
          <main>
            <form onSubmit={handleSubmit}>
              <label htmlFor="mobile_number">
                <input
                  type="tel"
                  id="mobile_number"
                  name="mobile_number"
                  value={formData.mobile_phone}
                  onChange={handleChange}
                  placeholder="Enter a customer's phone number"
                />
                </label>
                <button type="submit" className="btn btn-outline-secondary btn-sm">Find</button>
            </form>
                
                {errors.length > 0 && <Errors errors={errors} />}
                
                {reservations.length > 0 && (
                    <ReservationList reservations={reservations} />
                )}
                {submitted && reservations.length <= 0 &&
                    `No reservations found for mobile number: ${formData.mobile_number}`}
          </main>
        );  
}

export default Search;


//query = "mobile_phone" -> value == search input
//include value??


/*return (
    <SearchForm />
    <Reservations reservations={matchingReservations}
    
)*/
//display all reservations with any part of phone number that matches the input query.