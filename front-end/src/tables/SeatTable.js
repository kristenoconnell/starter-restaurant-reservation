import React from "react";
import { useHistory } from "react-router-dom";

function SeatTable({ tables }) {

    function loadTables() {
        
    }

    const history = useHistory();

    //define change handler
    const handleChange = async ({ target }) => {
        [target.name] = target.value;
    }

    //define submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();

    }

    //define initial form state??

    const selectTable = () => {
        <select id="table_id" name="table_id" onChange={handleChange}>
            <option value="">Select a Table</option>
            {tables.map((table) => (
                <option value={table.table_name}>{table.table_name} - {table.capacity}</option>
            ))}
        </select>
    }
    return (
        <div className="container">
            <div className="row">
                {selectTable}
            </div>
            <div className="row">
                <button type="submit" onClick={handleSubmit}>Save</button>
                <button onClick={() => history.goBack()}>Cancel</button>
            </div>
        </div>
    )
}

export default SeatTable;