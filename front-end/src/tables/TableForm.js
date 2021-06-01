import React from "react";
import { useHistory } from "react-router-dom";

function TableForm({ formData, handleChange, handleSubmit }) {
    const history = useHistory();
    
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="table_name">
                Table Name:
                 <input
                    type="text"
                    name="table_name"
                    id="table_name"
                    value={formData.table_name}
                    onChange={handleChange}
                    required
                    />
            </label>
            <br/>
            <label htmlFor="capacity">
                Capacity:
                 <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    />
            </label>
            <br/>
            <button className="btn btn-outline-danger btn-sm mr-1" onClick={() => history.goBack()}>Cancel</button>
            <button type="submit" className="btn-btn-outline-primary btn-sm">Save Table</button>
        </form>
    )
}

export default TableForm;

