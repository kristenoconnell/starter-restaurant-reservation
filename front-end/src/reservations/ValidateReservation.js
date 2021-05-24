

export default function ValidateReservation({
  first_name,
  last_name,
  mobile_number,
  reservation_date,
  reservation_time,
  people,
}) {

  const errors = [];

  const mobileFormat = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

  if (!first_name) {
    errors.push({ message: "Please enter first name." });
  }
  if (!last_name) {
    errors.push({ message: "Please enter last name." });
  }
  if (!mobile_number || !mobileFormat.test(mobile_number)) {
    errors.push({ message: "Please enter phone number: XXX-XXX-XXXX." });
  }
    
  if (!people || isNaN(Number(people)) || people < "0") {
    errors.push({message: "Please choose a party size of at least 1 person."})
  }

  if (!reservation_date || !reservation_time) {
    errors.push({
      message: "Please provide both a date and time for reservation.",
    });
  } else {
    const day = new Date(reservation_date).getUTCDay();
    if (day === 2) {
      errors.push({
        message:
          "The restaurant is closed on Tuesday. Please choose a different date.",
      });
    }

    const currentDate = Date.now();
    const reservationDate = new Date(
      `${reservation_date} ${reservation_time}`
    ).valueOf();

    if (currentDate > reservationDate) {
      errors.push({ message: "Cannot make a reservation in the past." });
    }

    if (reservation_time < "10:30" || reservation_time > "21:30") {
      errors.push({
        message: "Reservations can only be made between 10:30 AM and 9:30 PM.",
      });
    }
  }
    return errors;
}