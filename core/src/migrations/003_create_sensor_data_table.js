/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('sensor_data', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('plot_id').notNullable();
    table.decimal('temperature', 5, 2);
    table.decimal('humidity', 5, 2);
    table.decimal('soil_moisture', 5, 2);
    table.timestamp('timestamp').defaultTo(knex.fn.now());
    
    table.foreign('plot_id').references('id').inTable('plots').onDelete('CASCADE');
    table.index(['plot_id']);
    table.index(['timestamp']);
    table.index(['plot_id', 'timestamp']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('sensor_data');
};
