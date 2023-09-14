const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

//database functions

//admin functions
async function createAdmin({ username, password }) {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
    try {
        const {rows: [admin]} = await client.query(`
        INSERT INTO admins(username, password) VALUES ($1, $2)
        ON CONFLICT (username) DO NOTHING
        RETURNING id, username
        `, [username, hashedPassword]);
        return admin;
    } catch (error) {
        throw error;
    }
}

async function getAdmin({username, password}) {
    if (!username || !password) {
        return;
    }

    try {
        const user = await getAdminByUsername(username);
        if(!user) return;
        const hashedPassword = admin.password;
        const passwordsMatch = await bcrypt.compare(password, hashedPassword);
        if(!passwordsMatch) return;
        delete admin.password;
        return admin;
    } catch (error) {
        throw error;
    }
}

async function getAdminByUsername(userName) {
    //first get admin
    try {
        const {rows} = await client.query(`
        SELECT *
        FROM admins
        WHERE username = $1
        `, [userName]);
        //if it doesn't exist return null
        if (!rows || !rows.length) return null;
        //if it does delete password key from returned object
        const [admin] = rows;
        //delete user.password
        return admin;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    createAdmin,
    getAdmin,
    getAdminByUsername,
}