/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('alerts', function(table) {
    table.string('condition').nullable();
    table.decimal('threshold_value', 10, 2).nullable();
    table.decimal('actual_value', 10, 2).nullable();
    table.string('direction').nullable();
    table.index(['condition']);
    table.index(['direction']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('alerts', function(table) {
    table.dropColumn('condition');
    table.dropColumn('threshold_value');
    table.dropColumn('actual_value');
    table.dropColumn('direction');
  });
};
