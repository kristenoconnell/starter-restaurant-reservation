import React from 'react';

function ListTables({ tables }) {

    return (
        <div className="container">
            {tables.map((table) => (
                <div className="card" key={table.table_id}>
                        <div className="card-title mx-2 my-1">
                            {table.table_name}
                        </div>
                    <div className="row">
                        <div className="col-4 card-text text-muted mx-2">
                            Capacity: {table.capacity}
                            <br />
                        </div>
                        <div className="data-table-id-status=${table.table_id} col-6 text-muted">
                            Status: {table.status}         
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ListTables;