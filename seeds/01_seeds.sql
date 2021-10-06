-- user table
-- INSERT INTO users ( name, email, password) 
-- VALUES ( 'Nick Goali', 'nock@goal.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
--  ( 'Lisa Luck', 'liz@lac.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
--  ( 'Ben Bolsoi', 'ben@bol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- properties table
-- INSERT INTO properties ( owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active) 
-- VALUES (1,  'Blank corner', 'description', ' https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 85234, 3, 3, 7, 'Canada', '651 Nami Road', 'Bohbatev', ' Alberta', '83680', true),
-- ( 2, 'Habit mix', 'description', ' https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg?auto=compress&cs=tinysrgb&h=350 ', 'https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 46058 , 1, 5, 6, 'Canada', '1650 Hejto Center ', 'Genwezuj', ' Newfoundland And Labrador', '44583', true),
-- (3,  'Headed know', 'description', ' https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg',  82640,  0,  4, 5, 'Canada', '513 Powov Grove', 'Jaebvap', '  Ontario', '38051', true);

-- -- reservations table
-- INSERT INTO reservations ( start_date, end_date, property_id, guest_id) VALUES ( '2018-09-11', '2018-09-26', 2, 3);
-- INSERT INTO reservations ( start_date, end_date, property_id, guest_id) VALUES ( '2019-01-04', '2019-02-01', 2, 2);
-- INSERT INTO reservations ( start_date, end_date, property_id, guest_id) VALUES ( '2021-10-01', '2021-10-14', 1, 4);


-- -- -- property reviews
-- INSERT INTO property_reviews ( guest_id, property_id, reservation_id, rating, message) 
-- VALUES ( 2, 3, 5, 3, 'message'),
-- ( 1, 2, 4, 4, 'message'),
-- ( 3, 1, 6, 4, 'message');