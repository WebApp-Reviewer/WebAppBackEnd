const client = require('./client');
const util = require('./util');

//database functions 
async function getAllWebsites() {
    try {
        const {rows} = await client.query(`
        SELECT * FROM websites;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

async function getWebsiteById(id) {
    try {
        const {rows: [website]} = await client.query(`
        SELECT * from websites
        WHERE id = $1
        `, [id]);
        return website;
    } catch (error) {
        throw error;
    }
}

async function getWebsiteByName(name) {
    try {
        const {rows: [website]} = await client.query(`
        SELECT * FROM websites
        WHERE name = $1
        `, [name]);
        return website;
    } catch (error) {
        throw error;
    }
}

//select and return an array of all websites
async function createWebsite({ name, url, description, image }) {
    try {
        const {rows: [website]} = await client.query(`
        INSERT INTO websites(name, url, description, image) VALUES ($1, $2, $3, $4)
        ON CONFLICT (name) DO NOTHING
        RETURNING *
        `, [name, url, description, image]);
        return website;
    } catch (error) {
        throw error;
    }
}

async function updateWebsite({id, ...fields}) {
    try {
        const toUpdate = {}
        for (let column in fields) {
            if (fields[column] !== undefined) toUpdate[column] =fields[column];
        }
        let website;
        if (util.dbFields(toUpdate).insert.length > 0) {
            const {rows} = await client.query(`
            UPDATE websites
            SET ${ util.dbFields(toUpdate).insert }
            WHERE id=${ id }
            RETURNING *;
            `, Object.values(toUpdate));
            website = rows[0];
        }
        return website;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllWebsites,
    getWebsiteById,
    getWebsiteByName,
    createWebsite,
    updateWebsite,
}