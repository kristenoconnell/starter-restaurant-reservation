import React from 'react';

function ReservationForm({ formData, handleChange, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">
                First Name: 
                <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                />
            </label>
            <br/>
            <label htmlFor="last_name">
                Last Name:
                <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                />
            </label>
            <br/>
            <label htmlFor="mobile_number">
                Phone Number:
                <input
                    type="tel"
                    name="mobile_number"
                    id="mobile_number"
                    onChange={handleChange}
                    value={formData.mobile_number}
                    required
                />
            </label>
            <br/>
            <label htmlFor="reservation_date">
                Date:
                <input
                    type="date"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    name="reservation_date"
                    id="reservation_date"
                    onChange={handleChange}
                    value={formData.reservation_date}
                    required
                />
            </label>
            <br/>
            <label htmlFor="reservation_time">
                Time:
                <input
                    type="time"
                    placeholder="HH:MM"
                    pattern="[0-9]{2}:[0-9]{2}"
                    name="reservation_time"
                    id="reservation_time"
                    onChange={handleChange}
                    value={formData.reservation_time}
                    required
                />     
            </label>
            <br/>
            <label htmlFor="people">
                People in Party:
                 <input
                    type="number"
                    name="people"
                    id="people"
                    min="1"
                    onChange={handleChange}
                    value={formData.people}
                    required
                />
            </label>
        </form>
    )
}

export default ReservationForm;