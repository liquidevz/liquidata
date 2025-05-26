const mongoose = require('mongoose');
require('dotenv').config();

// Import JSON data
const teamData = require('../src/data/team.json');
const testimonialsData = require('../src/data/testimonials.json');

// Import models and database connection
const Team = require('../api/models/Team');
const Testimonial = require('../api/models/Testimonial');
const connectDB = require('../api/config/db');

// Migrate data
const migrateData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Team.deleteMany({});
    await Testimonial.deleteMany({});
    console.log('Cleared existing data');

    // Transform and insert team data
    const transformedTeamData = transformTeamData(teamData);
    await Team.insertMany(transformedTeamData);
    console.log('Team data migrated successfully');

    // Transform and insert testimonials data
    const transformedTestimonialsData = transformTestimonialsData(testimonialsData);
    await Testimonial.insertMany(transformedTestimonialsData);
    console.log('Testimonials data migrated successfully');

    console.log('All data migrated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

// Transform team data to match schema
const transformTeamData = (data) => {
  return data.map(member => ({
    name: member.name,
    position: member.subName,
    imageUrl: member.img,
    socialLinks: {
      facebook: '#',
      twitter: '#',
      instagram: '#'
    }
  }));
};

// Transform testimonials data to match schema
const transformTestimonialsData = (data) => {
  return data.map(testimonial => ({
    name: testimonial.name,
    position: testimonial.subName.split('&')[0].trim(),
    company: testimonial.subName.includes('&') ? testimonial.subName.split('&')[1].trim() : testimonial.subName,
    image: testimonial.img,
    testimonial: testimonial.desc,
    rating: 5
  }));
};

migrateData(); 