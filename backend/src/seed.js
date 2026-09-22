import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "./constants.js";
import { Category } from "./models/category.model.js";

const categories = [
  {
    name: "Web Development",
    description: "HTML, CSS, JavaScript, React, Node.js and other web technologies",
  },
  {
    name: "Mobile Development",
    description: "Android, iOS, Flutter, React Native and mobile app development",
  },
  {
    name: "Data Science",
    description: "Machine Learning, AI, Data Analysis, Python and statistics",
  },
  {
    name: "Programming Languages",
    description: "Java, Python, C++, Go, Rust and other programming languages",
  },
  {
    name: "Database",
    description: "SQL, MongoDB, PostgreSQL, Redis and database management",
  },
  {
    name: "DevOps",
    description: "Docker, Kubernetes, CI/CD, AWS, Azure and cloud infrastructure",
  },
  {
    name: "Cyber Security",
    description: "Ethical hacking, network security, cryptography and penetration testing",
  },
  {
    name: "UI/UX Design",
    description: "Figma, Adobe XD, wireframing, prototyping and design principles",
  },
  {
    name: "DSA",
    description: "Data Structures, Algorithms, competitive programming and problem solving",
  },
  {
    name: "Computer Science",
    description: "Operating systems, computer networks, DBMS and core CS fundamentals",
  },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("Connected to MongoDB");

    // Clear existing categories
    await Category.deleteMany({});
    console.log("Cleared existing categories");

    // Insert new categories
    const result = await Category.insertMany(categories);
    console.log(`Inserted ${result.length} categories:`);

    result.forEach((cat) => {
      console.log(`  - ${cat.name}`);
    });

    await mongoose.disconnect();
    console.log("\nDone! Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedCategories();
