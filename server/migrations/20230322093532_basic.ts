exports.up = async function (knex) {
  await Promise.all([
    knex.schema.createTable('artist', (table) => {
      table
        .uuid('id')
        .primary()
        .unique()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').index().notNullable();
      table.string('itunesId').index();
    }),
    knex.schema.createTable('album', (table) => {
      table
        .uuid('id')
        .primary()
        .unique()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').index().notNullable();
      table
        .uuid('artistId')
        .index()
        .notNullable()
        .references('id')
        .inTable('artist');
      table.integer('showed').defaultTo(0).notNullable();
      table.integer('guessed').defaultTo(0).notNullable();
    }),
    knex.schema.createTable('user', (table) => {
      table
        .uuid('id')
        .primary()
        .unique()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').unique().notNullable();
      table.integer('score').defaultTo(0).notNullable();
    }),
  ]);

  const artists = [
    'Rammstein',
    'Eminem',
    'Lady Gaga',
    'Megadeth',
    'Queen',
    'Five Finger Death Punch',
    'AC/DC',
    'Metallica',
    'Rianna',
    'Disturbed',
  ];

  const mappedArtists = artists.map((item) => ({
    name: item,
    itunesId: null,
  }));

  await knex('artist').insert(mappedArtists);
};

exports.down = async function (knex) {
  await knex.schema.dropTable('album');
  await knex.schema.dropTable('artist');
  await knex.schema.dropTable('user');
};
