/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('alerts', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('plot_id').notNullable();
    table.string('alert_type').notNullable();
    table.text('message').notNullable();
    table.string('severity').notNullable();
    table.string('status').defaultTo('active');
    table.timestamp('delivered_at');
    table.timestamp('acknowledged_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.foreign('plot_id').references('id').inTable('plots').onDelete('CASCADE');
    table.index(['plot_id']);
    table.index(['status']);
    table.index(['severity']);
    table.index(['alert_type']);
    table.index(['created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('alerts');
};
