const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const { user } = require('pg/lib/defaults');

const config = {
  user: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
  password: '123',
  port: 5432,
  };

const pool = new Pool(config);
pool.connect();

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

  
 const getUserWithEmail = function(email) {
 const sql = 
  `SELECT * FROM users
   WHERE email = $1`;

   return pool
    .query(sql, [email])
    .then(result => {
      console.log(result)
      if (!result.rows[0]) {
        return null;
      } else {
        return result.rows[0];
      }
    })
    .catch(err => console.error('input error', err.stack));

 };

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

 const getUserWithId = function (id) {
  if(user.email !== user.id){
    return null;
  }
const sql = 
 `SELECT * FROM users
  WHERE email = $1`;

  return pool
   .query(sql, [id])
   .then(result => {
    return result.rows;
   })
   .catch(err => console.error('input error', err.stack));
 };

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

 const addUser = function (user) {

   const newUser = `
   INSERT INTO users (name, email, password ) 
   VALUES ($1, $2, $3)
   RETURNING*
   `;
   return pool
   .query(newUser,[user.name, user.email, user.password])
   .then((result) => {
     console.log('resolved')
     return result.rows;
   })
   .catch((e) => {
     console.log(e.message);
   })
 };


exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (option, limit = 10) => {
  const queryString = `SELECT * FROM properties LIMIT $1`;
  
  return pool
    .query(queryString, [limit])
    .then((res) => {
      console.log(res.rows);
      return res.rows;
    })
    .catch((err) => {
      console.log(err.message);
     });
  };

exports.getAllProperties = getAllProperties;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
