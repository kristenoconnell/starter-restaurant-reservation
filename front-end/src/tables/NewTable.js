import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

function NewTable() {

    const initialFormState = {
        table_name: "",
        capacity: 1,
        status: "Free",
    }

    const [formData, setFormData] = useState({ ...initialFormState });
    const abortController = new AbortController();
    const history = useHistory();

    
    const handleChange = ({ target }) => {
        const value = target.value;
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createTable(formData);
            history.push("/dashboard");
            //await create table function here
            //push to dashboard page once submitted
        } catch (error) {
            throw error;
        }
    };

    return (
        <TableForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
    )
}

export default NewTable;