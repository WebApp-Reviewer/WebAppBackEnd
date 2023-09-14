const client = require('./client');
const util = require('./util');

//databse functions
async function getAllReviews() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM reviews;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getReviewById(id) {
    try {
        const {rows: [review]} = await client.query(`
        SELECT * FROM reviews
        WHERE id = $1
        `, [id]);
        return review;
    } catch (error) {
        throw error;
    }
}

async function getReviewByName(name) {
    try {
        const {rows: [review]} = await client.query(`
        SELECT * FROM reviews
        WHERE name = $1
        `, [name]);
        return review;
    } catch (error) {
        throw error;
    }
}

async function createReview({ name, content, rating }) {
    try {
        const {rows: [review]} = await client.query(`
        INSERT INTO reviews(name, content, rating) VALUES ($1, $2, $3)
        ON CONFLICT (name) DO NOTHING
        RETURNING *
        `, [name, content, rating]);
        return review;
    } catch (error) {
        throw error;
    }
}

async function updateReview({id, ...fields}){
    try {
      const toUpdate = {}
      for(let column in fields) {
        if(fields[column] !== undefined) toUpdate[column] = fields[column];
      }
      let review;
      if (util.dbFields(toUpdate).insert.length > 0) {
        const {rows} = await client.query(`
          UPDATE reviews
          SET ${ util.dbFields(toUpdate).insert }
          WHERE id=${ id }
          RETURNING *;
        `, Object.values(toUpdate));
        review = rows[0];
      }
      return review;
    } catch (error) {
      throw error
    }
}

module.exports = {
    getAllReviews,
    getReviewById,
    getReviewByName,
    createReview,
    updateReview,
}