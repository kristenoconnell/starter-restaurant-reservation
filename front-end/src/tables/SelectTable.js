import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function SelectTable({ tables, reservation, handleChange, handleSubmit, formData, setFormData }) {
    const history = useHistory();

  const openTables = tables.filter((table) => {
    return table.capacity >= reservation.people;
  });

    if (!openTables.length) {
        return (
            <div>
                <ErrorAlert
                    error={{
                        message: `There are no tables currently available for a party of ${reservation.people}. Please wait for an open table.`,
                    }}
                />
                <button onClick={() => history.push("/")}>Back to Dashboard</button>
            </div>
        );
    } else if (openTables.length) {
       

    return (
        <div className="container">
            <div className="row">
                <div className="col-6">
                <h3 className="text-muted text-center">
                    {reservation.first_name} {reservation.last_name}:
                </h3>
                <br />
                <h4 className="text-muted text-center">
                    Party of {reservation.people} on {reservation.reservation_date} at {reservation.reservation_time.slice(0,5)}
                </h4>
                <br />
                <p className="text-muted text-center">
                    Phone number: {reservation.mobile_number}
                </p>
                </div>
                </div>
            <div className="row mx-auto">
                <form onSubmit={handleSubmit}>
            <select
              className="form-select"
              name="table_id"
                        onChange={handleChange}
                        style={{ width: 200}}
            >
                        <option defaultValue className="text-center">Select a Table</option>
                        {openTables.map((table, index) => (
                            <option value={table.table_name} id={table.table_id} key={index}>
                                {table.table_name} - {table.capacity}
                            </option>
                        ))}
                        )
            </select>

          <div className="row py-2">
            <button type="submit">Save</button>
            <button onClick={() => history.goBack()}>Cancel</button>
          </div>
                </form>
            </div>
        </div>
        
    );
  }
}

export default SelectTable;
