const db = require('../../data/db-config')

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */

    return db('schemes as sc')
      .leftJoin('Steps as st', 'st.scheme_id', 'sc.scheme_id')
      .select('sc.*')
      .groupBy('sc.scheme_id')
      .count('st.step_id as number_of_steps')
}

async function findById(schID) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */

      const arr = await db('schemes as sch')
        .leftJoin('steps as st', 'sch.scheme_id', 'st.scheme_id')
        .select('sch.scheme_id', 'sch.scheme_name', 'step_id', 'step_number', 'instructions')
        .where({'sch.scheme_id': schID})
        .orderBy('step_number')
        if( !arr.length ) return;
        const { scheme_name, scheme_id} = arr[0];
      return ({
        scheme_name, scheme_id,
        steps: arr
          .filter(st => st.step_id !== null)
          .map(item => ({step_id: item.step_id, step_number: item.step_number, instructions: item.instructions}))
      })
}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
 return db('schemes as sch')
    .leftJoin('steps as st', 'sch.scheme_id', 'st.scheme_id')
    .select('step_id', 'step_number', 'instructions', 'sch.scheme_name')
    .where({'sch.scheme_id': scheme_id})
    .orderBy('step_number')
    .then(arr => arr.filter(item => item.step_id !== null));
}

function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
 return db('schemes')
  .insert(scheme)
  .then(schArrId => findById(schArrId[0]))
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 return db('steps')
  .insert({...step, scheme_id})
  .then(() => findSteps(scheme_id))
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep
}
