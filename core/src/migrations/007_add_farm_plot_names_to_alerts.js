/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('alerts', function(table) {
    table.string('farm_name').nullable();
    table.string('plot_name').nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('alerts', function(table) {
    table.dropColumn('farm_name');
    table.dropColumn('plot_name');
  });
};
