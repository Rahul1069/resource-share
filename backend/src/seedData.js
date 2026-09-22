import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "./constants.js";
import { User } from "./models/user.model.js";
import { Category } from "./models/category.model.js";
import { Resource } from "./models/resource.model.js";
import { Post } from "./models/community.model.js";
import { Favorite } from "./models/favorite.model.js";
import { Download } from "./models/download.model.js";

const seedData = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB");

    // ─── Fetch existing users & categories ───
    const users = await User.find();
    const categories = await Category.find();

    if (users.length === 0) {
      console.error("❌ No users found. Please signup users first.");
      process.exit(1);
    }
    if (categories.length === 0) {
      console.error("❌ No categories found. Please run seed.js first.");
      process.exit(1);
    }

    console.log(`Found ${users.length} users and ${categories.length} categories`);

    // Helper to find category by name
    const cat = (name) => categories.find((c) => c.name === name)?._id;

    // ─── Clear old data (keep users & categories) ───
    await Resource.deleteMany({});
    await Post.deleteMany({});
    await Favorite.deleteMany({});
    await Download.deleteMany({});
    console.log("🗑️  Cleared old resources, posts, favorites & downloads");

    // ─── SEED RESOURCES ───
    const resourcesData = [
      {
        title: "Complete React.js Cheat Sheet",
        description:
          "A comprehensive cheat sheet covering React hooks, state management, component lifecycle, and best practices for modern React development.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/react-cheatsheet.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/react-thumb.png",
        category_id: cat("Web Development"),
        user_id: users[0]._id,
        downloads: 42,
      },
      {
        title: "Node.js & Express API Design Guide",
        description:
          "Learn how to design RESTful APIs with Node.js and Express. Covers routing, middleware, error handling, authentication, and deployment.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/nodejs-api-guide.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/nodejs-thumb.png",
        category_id: cat("Web Development"),
        user_id: users[0]._id,
        downloads: 35,
      },
      {
        title: "Python for Data Science - Beginner Guide",
        description:
          "A beginner-friendly guide to using Python for data analysis with Pandas, NumPy, and Matplotlib. Includes practical examples and exercises.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/python-ds.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/python-ds-thumb.png",
        category_id: cat("Data Science"),
        user_id: users.length > 1 ? users[1]._id : users[0]._id,
        downloads: 67,
      },
      {
        title: "Machine Learning Algorithms Overview",
        description:
          "An overview of popular ML algorithms including linear regression, decision trees, random forests, SVM, and neural networks with real-world use cases.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/ml-algorithms.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/ml-thumb.png",
        category_id: cat("Data Science"),
        user_id: users.length > 1 ? users[1]._id : users[0]._id,
        downloads: 89,
      },
      {
        title: "Flutter App Development Crash Course Notes",
        description:
          "Detailed notes from a Flutter crash course covering widgets, state management with Provider, navigation, and Firebase integration.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/flutter-notes.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/flutter-thumb.png",
        category_id: cat("Mobile Development"),
        user_id: users.length > 2 ? users[2]._id : users[0]._id,
        downloads: 28,
      },
      {
        title: "DSA Problem Solving Patterns",
        description:
          "Master the most common DSA patterns: sliding window, two pointers, fast & slow pointers, merge intervals, and more with 50+ solved problems.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/dsa-patterns.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/dsa-thumb.png",
        category_id: cat("DSA"),
        user_id: users[0]._id,
        downloads: 120,
      },
      {
        title: "Docker & Kubernetes Handbook",
        description:
          "A practical handbook for containerization with Docker and orchestration with Kubernetes. Covers Docker Compose, Helm charts, and CI/CD pipelines.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/docker-k8s.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/docker-thumb.png",
        category_id: cat("DevOps"),
        user_id: users.length > 2 ? users[2]._id : users[0]._id,
        downloads: 54,
      },
      {
        title: "MongoDB Complete Reference Guide",
        description:
          "Everything you need to know about MongoDB: CRUD operations, aggregation pipeline, indexing, replication, and sharding explained with examples.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/mongodb-guide.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/mongodb-thumb.png",
        category_id: cat("Database"),
        user_id: users[0]._id,
        downloads: 76,
      },
      {
        title: "Ethical Hacking for Beginners",
        description:
          "Introduction to ethical hacking and penetration testing. Covers network scanning, vulnerability assessment, Metasploit, and Burp Suite basics.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/ethical-hacking.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/hacking-thumb.png",
        category_id: cat("Cyber Security"),
        user_id: users.length > 1 ? users[1]._id : users[0]._id,
        downloads: 93,
      },
      {
        title: "UI/UX Design Principles & Figma Tutorial",
        description:
          "Learn essential UI/UX design principles along with a hands-on Figma tutorial. Covers wireframing, prototyping, color theory, and typography.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/uiux-figma.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/uiux-thumb.png",
        category_id: cat("UI/UX Design"),
        user_id: users.length > 2 ? users[2]._id : users[0]._id,
        downloads: 41,
      },
      {
        title: "Java OOP Concepts Explained",
        description:
          "A thorough explanation of Object-Oriented Programming in Java: classes, objects, inheritance, polymorphism, abstraction, and encapsulation.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/java-oop.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/java-thumb.png",
        category_id: cat("Programming Languages"),
        user_id: users.length > 1 ? users[1]._id : users[0]._id,
        downloads: 58,
      },
      {
        title: "Operating Systems Notes - Gate Preparation",
        description:
          "Comprehensive notes on operating systems for GATE exam preparation. Covers process management, memory management, file systems, and deadlocks.",
        file_url: "https://ik.imagekit.io/rushi/resource-share/sample/os-notes.pdf",
        thumbnail_url: "https://ik.imagekit.io/rushi/resource-share/sample/os-thumb.png",
        category_id: cat("Computer Science"),
        user_id: users[0]._id,
        downloads: 112,
      },
    ];

    const resources = await Resource.insertMany(resourcesData);
    console.log(`📚 Inserted ${resources.length} resources`);

    // ─── SEED COMMUNITY POSTS ───
    const postsData = [
      {
        content:
          "Just finished building my first full-stack MERN project! 🚀 It's a resource sharing platform where students can upload and download study materials. Feeling proud! #webdev #mern",
        user_id: users[0]._id,
        likes: users.length > 1 ? [users[1]._id, ...(users.length > 2 ? [users[2]._id] : [])] : [],
        comments: [
          ...(users.length > 1
            ? [{ user_id: users[1]._id, text: "That's amazing! Can you share the GitHub repo?" }]
            : []),
          ...(users.length > 2
            ? [{ user_id: users[2]._id, text: "Congrats bro! Keep building 💪" }]
            : []),
        ],
      },
      {
        content:
          "Does anyone have good resources for learning system design? I'm preparing for interviews and need to understand distributed systems, load balancing, and database sharding.",
        user_id: users.length > 1 ? users[1]._id : users[0]._id,
        likes: [users[0]._id],
        comments: [
          {
            user_id: users[0]._id,
            text: "Check out 'Designing Data-Intensive Applications' by Martin Kleppmann. It's the gold standard!",
          },
        ],
      },
      {
        content:
          "Tips for cracking DSA interviews:\n1. Focus on patterns, not individual problems\n2. Practice at least 2 problems daily\n3. Revise your solved problems weekly\n4. Time yourself during practice\n5. Explain your approach out loud\n\nGood luck to everyone preparing! 🎯",
        user_id: users.length > 2 ? users[2]._id : users[0]._id,
        likes:
          users.length > 2
            ? [users[0]._id, users[1]._id]
            : users.length > 1
              ? [users[0]._id]
              : [],
        comments: [
          {
            user_id: users[0]._id,
            text: "This is gold! Saving this post. Thanks for sharing 🙏",
          },
          ...(users.length > 1
            ? [
                {
                  user_id: users[1]._id,
                  text: "Pattern-based approach worked wonders for me. Totally agree!",
                },
              ]
            : []),
        ],
      },
      {
        content:
          "Just uploaded my Docker & Kubernetes notes on the platform. Covers everything from basic containers to production-grade K8s deployments. Hope it helps someone! 📦",
        user_id: users.length > 2 ? users[2]._id : users[0]._id,
        likes: users.length > 1 ? [users[0]._id, users[1]._id] : [users[0]._id],
        comments: [],
      },
      {
        content:
          "Hot take: TypeScript should be the default for all new JavaScript projects. The type safety alone saves hours of debugging. What do you all think? 🤔",
        user_id: users[0]._id,
        likes: users.length > 1 ? [users[1]._id] : [],
        comments: [
          ...(users.length > 1
            ? [
                {
                  user_id: users[1]._id,
                  text: "100% agree! Once you go TypeScript, you never go back.",
                },
              ]
            : []),
          ...(users.length > 2
            ? [
                {
                  user_id: users[2]._id,
                  text: "For large projects yes, but for small scripts JS is still fine IMO.",
                },
              ]
            : []),
        ],
      },
    ];

    const posts = await Post.insertMany(postsData);
    console.log(`💬 Inserted ${posts.length} community posts`);

    // ─── SEED FAVORITES ───
    const favoritesData = [
      { user_id: users[0]._id, resource_id: resources[2]._id },
      { user_id: users[0]._id, resource_id: resources[5]._id },
      { user_id: users[0]._id, resource_id: resources[8]._id },
    ];

    if (users.length > 1) {
      favoritesData.push(
        { user_id: users[1]._id, resource_id: resources[0]._id },
        { user_id: users[1]._id, resource_id: resources[5]._id },
        { user_id: users[1]._id, resource_id: resources[7]._id }
      );
    }
    if (users.length > 2) {
      favoritesData.push(
        { user_id: users[2]._id, resource_id: resources[1]._id },
        { user_id: users[2]._id, resource_id: resources[3]._id }
      );
    }

    const favorites = await Favorite.insertMany(favoritesData);
    console.log(`⭐ Inserted ${favorites.length} favorites`);

    // ─── SEED DOWNLOADS ───
    const downloadsData = [
      { user_id: users[0]._id, resource_id: resources[2]._id },
      { user_id: users[0]._id, resource_id: resources[3]._id },
      { user_id: users[0]._id, resource_id: resources[5]._id },
    ];

    if (users.length > 1) {
      downloadsData.push(
        { user_id: users[1]._id, resource_id: resources[0]._id },
        { user_id: users[1]._id, resource_id: resources[5]._id },
        { user_id: users[1]._id, resource_id: resources[11]._id }
      );
    }
    if (users.length > 2) {
      downloadsData.push(
        { user_id: users[2]._id, resource_id: resources[1]._id },
        { user_id: users[2]._id, resource_id: resources[7]._id },
        { user_id: users[2]._id, resource_id: resources[8]._id }
      );
    }

    const downloads = await Download.insertMany(downloadsData);
    console.log(`⬇️  Inserted ${downloads.length} downloads`);

    // ─── SUMMARY ───
    console.log("\n========================================");
    console.log("🎉 Seed Data Summary:");
    console.log(`   👤 Users:      ${users.length} (existing)`);
    console.log(`   🏷️  Categories: ${categories.length} (existing)`);
    console.log(`   📚 Resources:  ${resources.length}`);
    console.log(`   💬 Posts:      ${posts.length}`);
    console.log(`   ⭐ Favorites:  ${favorites.length}`);
    console.log(`   ⬇️  Downloads:  ${downloads.length}`);
    console.log("========================================\n");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Done! ✅");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
};

seedData();
