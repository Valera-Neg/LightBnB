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
     console.log(e);
   })
 };


exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

 const getFulfilledReservations = function (guest_id, limit = 10) {
  const allUserReservation = `
  SELECT properties.*, reservations.*, avg(property_reviews.rating) as average_rating 
  FROM reservations JOIN properties ON properties.id = reservations.property_id 
  JOIN property_reviews ON property_reviews.property_id = properties.id  
  WHERE end_date < now()::date AND reservations.guest_id = $1 
  GROUP BY properties.id, reservations.id
  LIMIT $2
  `;
 
    return pool
    .query(allUserReservation, [guest_id, limit])
    .then(result => {
      return result.rows;
    })
    .catch((err) => {
      console.log( 'error: ' , err);
    });

};

exports.getFulfilledReservations = getFulfilledReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id 
  `;
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString +=`WHERE city LIKE $${queryParams.length}`
  }

  if (options.ovner_id) {
    queryParams.push(`${options.owner_id}`)
    queryString += ` AND owner_id = $${queryParams.length}`
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`)
    queryString += ` AND  cost_per_night >= $${queryParams.length}`
  }
  
  if (options.maximum_price_per_night) {
      queryParams.push(`${options.maximum_price_per_night}`)
      queryString += ` AND  cost_per_night <= $${queryParams.length}`
  } 
  
  if (options. minimum_rating) {
    queryParams.push(`${options. minimum_rating}`)
    queryString += ` AND property_reviews.rating >= $${queryParams.length}`
  }

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length}
  `;

  // console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then((res) => res.rows).catch(err => console
  .error('input error', err.stack))
  
  };

exports.getAllProperties = getAllProperties;


//
//  Gets upcoming reservations
//
const getUpcomingReservations = function(guest_id, limit = 10) {
  const queryString = `
  SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`;
  const params = [guest_id, limit];
    return pool
    .query(queryString, params)
    .then(res => res.rows)
    .catch((e) => {
      console.log(e);
    })
};
exports.getUpcomingReservations = getUpcomingReservations;



const getIndividualReservation = function(reservationId) {
const queryString = `
SELECT * FROM reservations
WHERE reservations.id = $1
`;
const params = [reservationId]
return pool
  .query(queryString, params)
  .then(res => res.rows[0])
  .catch((e) => {
    console.log(e)
  })
};

exports.getIndividualReservation = getIndividualReservation;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const newProperty = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,  
    cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING*
   `;
   return pool
   .query(newProperty,[property.owner_id, property.title, property.description,  
    property.thumbnail_photo_url, property.cover_photo_url,  property.cost_per_night, 
    property.street, property.city, property.province, property.post_code,  
    property.country, property.parking_spaces, property.number_of_bathrooms, 
    property.number_of_bedrooms])
   
    .then((result) => {
     console.log('resolved: =>')
     return result.rows;
   })
   .catch((e) => {
     console.log(e);
   })
};
exports.addProperty = addProperty;

  /*
   * Adds a reservation from a specific user to the database
   */  
const addReservation = function(reservation) {
 return pool
    .query(`
    INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ($1, $2, $3, $4) RETURNING *
    `, [reservation.start_date, reservation.end_date, reservation.property_id, reservation.guest_id])
    .then ((res) => {
      console.log(res);
     return res.rows;
    })
    .catch((e) => {
      console.log(e);
    })
};

exports.addReservation = addReservation;




//
//  Updates an existing reservation with new information
//
const updateReservation = function(reservationData) {
    let queryString = `UPDATE reservations SET` 
    let params = [];
    if (reservationData.start_date){
      params.push(reservationData.start_date);
      queryString += `start_date = $1`;
    }
    if (reservationData.end_date) {
      params.push(reservationData.end_date);
      queryString += `start_date = $2`;
    } else {
      params.push(reservationData.end_date);
      queryString += `start_date = $1`;
    }
    queryString += ` WHERE id = $${params.length + 1} RETURNING *;` 
    params.push(reservationData.reservation_id);
    console.log(queryString);
    return pool
    .query(queryString, params)
    .then((res) => {
      console.log(res.rows[0])
      return res.rows[0];
    })
    .catch((e) => {
      console.log(e)
    })
};
exports.updateReservation = updateReservation;

//
//  Deletes an existing reservation
//
const deleteReservation = function(reservationId) {

}



// (`UPDATE reservations
//     SET start_date = ${newReservationData.start_date}, 
//         end date = ${newReservationData.end_data},
//         property_id = ${newReservationData.property_id},
//         guest_id = ${newReservationData.guest_id}`)