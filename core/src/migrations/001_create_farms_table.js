/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('farms', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('owner_name').notNullable();
    table.specificType('location', 'geometry(Point, 4326)');
    table.specificType('boundary', 'geometry(Polygon, 4326)');
    table.decimal('total_area', 10, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.index(['name']);
    table.index(['owner_name']);
    table.index(['location'], 'farms_location_idx', 'gist');
    table.index(['boundary'], 'farms_boundary_idx', 'gist');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('farms');
};
