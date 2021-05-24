<<<<<<< HEAD
//This file got deleted after not migrating properly and corrupted the directory
//I added it back in so I could migrate the other Tables migration
//It is empty but apparently necessary.

exports.up = function (knex) {
    
};

exports.down = function (knex) {

};
=======

exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
        table.increments("table_id").primary();
        table.string("table_name").notNullable();
        table.integer("capacity").notNullable();
        table.string("status").notNullable().defaultTo("Free");
        table.integer("reservation_id")
        table.foreign("reservation_id")
            .references("reservation_id")
            .inTable("reservations")
            .onDelete("CASCADE");
        table.timestamps(true, true);
    })
};

exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  
};
>>>>>>> parent of a68b8ba... Delete 20210521043233_createTablesTable.js
