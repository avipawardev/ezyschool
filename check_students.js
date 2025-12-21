
const mongoose = require('mongoose');
const Course = require('./server/models/Course'); 
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'server/.env') });

const checkStudents = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB');

    const courses = await Course.find({ _id: "6944392746fac2a276515014" });
    console.log(`Found ${courses.length} courses for ID 6944392746fac2a276515014.`);

    courses.forEach(c => {
        console.log(`Course Title: ${c.title}`);
        console.log(`Raw Students Array:`, JSON.stringify(c.students, null, 2));
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkStudents();
