import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

function SelectTable({ tables, reservation, handleChange, handleSubmit }) {
  const history = useHistory();
  //let capacity = 0;

  const openTables = tables.filter((table) => {
    return table.status === "Free" && table.capacity >= reservation.people;
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
    const tableOptions = openTables.map((table) => {
      <option value={table.table_name} key={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>;
    });

    return (
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <select
              className="form-select"
              id="table_id"
              name="table_id"
              onChange={handleChange}
            >
              <option value="">Select a Table</option>
              {tableOptions}
            </select>
          </div>

          <div className="row">
            <button type="submit">Save</button>
            <button onClick={() => history.goBack()}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SelectTable;
