import React from 'react';
import Errors from "../errors/Errors";

function ListTables({ tables, handleFinish }) {
  
  return (
      <div className="container">
        {tables.map((table) => (
          <div className="card" key={table.table_id}>
            <div className="card-title mx-2 my-1">{table.table_name}</div>
            <div className="row">
              <div className="col-4 card-text text-muted mx-2">
                Capacity: {table.capacity}
                <br />
              </div>
              <div className="col-6 text-muted mx-2">
                {table.reservation_id ? (
                  <div data-table-id-status={table.table_id}>
                                Status: Occupied
                                <button data-table-id-finish={table.table_id}
                      value={table.table_id}
                      onClick={handleFinish}
                    >
                      Finish
                    </button>
                  </div>
                ) : (
                  <div data-table-id-status={table.table_id}>
                    Status: Free
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}

export default ListTables;