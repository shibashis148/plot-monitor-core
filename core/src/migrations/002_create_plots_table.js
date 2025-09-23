/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('plots', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('farm_id').notNullable();
    table.string('name').notNullable();
    table.string('plot_number').notNullable();
    table.specificType('boundary', 'geometry(Polygon, 4326)');
    table.decimal('area', 10, 2);
    table.string('crop_type');
    table.string('status').defaultTo('healthy');
    table.jsonb('alert_thresholds');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('farm_id').references('id').inTable('farms').onDelete('CASCADE');
    
    table.index(['farm_id']);
    table.index(['plot_number']);
    table.index(['status']);
    table.index(['crop_type']);
    table.index(['boundary'], 'plots_boundary_idx', 'gist');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('plots');
};
