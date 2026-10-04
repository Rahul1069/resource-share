import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "./constants.js";
import { User } from "./models/user.model.js";
import { Post } from "./models/community.model.js";

const demoUsers = [
  {
    name: "Priya Sharma",
    email: "priya@gmail.com",
    password: "Password123!",
  },
  {
    name: "Alex Chen",
    email: "alex@gmail.com",
    password: "Password123!",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@gmail.com",
    password: "Password123!",
  },
  {
    name: "Rahul Kumar",
    email: "rahul@gmail.com",
    password: "Password123!",
  },
];

const seedCommunityPosts = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("✅ Connected to MongoDB Atlas");

    // 1. Ensure we have multiple active users
    let existingUsers = await User.find();
    console.log(`Found ${existingUsers.length} existing users.`);

    for (const demoUser of demoUsers) {
      const exists = existingUsers.some((u) => u.email === demoUser.email);
      if (!exists) {
        const newUser = await User.create(demoUser);
        existingUsers.push(newUser);
        console.log(`Created demo user: ${newUser.name} (${newUser.email})`);
      }
    }

    const u0 = existingUsers[0]._id;
    const u1 = existingUsers.length > 1 ? existingUsers[1]._id : u0;
    const u2 = existingUsers.length > 2 ? existingUsers[2]._id : u0;
    const u3 = existingUsers.length > 3 ? existingUsers[3]._id : u1;
    const u4 = existingUsers.length > 4 ? existingUsers[4]._id : u2;

    // 2. Clear old community posts
    await Post.deleteMany({});
    console.log("🗑️ Cleared existing community posts");

    // 3. Seed realistic, rich community posts
    const postsData = [
      {
        content:
          "Just uploaded a comprehensive React 19 & Next.js 15 roadmap notes! 🚀 It covers server actions, App Router best practices, optimization hooks, and state management strategies. Check it out in the Web Development section and let me know your thoughts!",
        image_url: "",
        user_id: u0,
        likes: [u1, u2, u3],
        comments: [
          {
            user_id: u1,
            text: "This is super detailed and well-structured! Saved it immediately. Thank you for sharing! 🙌",
          },
          {
            user_id: u2,
            text: "Does it cover optimistic updates with useActionState? Looking to integrate that into my final year project.",
          },
          {
            user_id: u0,
            text: "Yes Alex! Section 4 has a complete code walkthrough of useActionState and useOptimistic. Hope it helps!",
          },
        ],
      },
      {
        content:
          "Top 5 Data Structures & Algorithms patterns that show up in 90% of technical interviews:\n\n1. Sliding Window (Substrings, subarray sums)\n2. Two Pointers (Palindrome, trapped rainwater)\n3. Fast & Slow Pointers (Cycle detection)\n4. Monotonic Stack (Next greater element)\n5. Modified Binary Search (Rotated arrays)\n\nMaster the patterns instead of memorizing 500 questions. Consistency beats cramming! 💡",
        image_url: "",
        user_id: u1,
        likes: [u0, u2, u3, u4],
        comments: [
          {
            user_id: u0,
            text: "100% agreed! Pattern recognition is the single most important skill for LeetCode medium/hard.",
          },
          {
            user_id: u3,
            text: "Bookmarked! Could you also share your favorite curated problem list for these patterns?",
          },
        ],
      },
      {
        content:
          "Study Group Alert! 📚 We are organizing a weekend peer review session for System Design: building rate limiters, distributed caches (Redis), and message queues (Kafka). Comment below if you want to join our Discord study circle!",
        image_url: "",
        user_id: u2,
        likes: [u0, u1, u3],
        comments: [
          {
            user_id: u3,
            text: "Count me in! I've been reading Kleppmann's DDIA book and would love to practice mock designs.",
          },
          {
            user_id: u4,
            text: "Interested! What time zone are you planning to host it?",
          },
          {
            user_id: u2,
            text: "We're meeting Saturday 6 PM IST / 8:30 AM EST. Will ping you the link!",
          },
        ],
      },
      {
        content:
          "Shared my Semester 6 Operating Systems & DBMS question paper solutions along with handwritten diagrams! Topics include Banker's Algorithm, Virtual Memory paging, B+ Trees, and Normalization (1NF to BCNF). Hope this eases your exam prep!",
        image_url: "",
        user_id: u3,
        likes: [u0, u1, u2, u4],
        comments: [
          {
            user_id: u0,
            text: "Your handwriting and clean schematics are legendary! Lifesaver for midterms.",
          },
          {
            user_id: u1,
            text: "Thank you so much! B+ tree deletions were always confusing, your step-by-step example made it crystal clear.",
          },
        ],
      },
      {
        content:
          "Hot discussion: SQL vs NoSQL for modern web applications. When should you pick PostgreSQL over MongoDB, and vice versa? What has been your real-world experience regarding schema migrations and relational joins? Drop your thoughts below! 💬⚡",
        image_url: "",
        user_id: u4,
        likes: [u0, u1, u2],
        comments: [
          {
            user_id: u1,
            text: "Postgres with jsonb gives you the best of both worlds. Strict relational schemas for financial & user auth, and jsonb for dynamic attributes!",
          },
          {
            user_id: u2,
            text: "MongoDB is brilliant for rapid prototyping and documents with polymorphic shapes. But for anything requiring strict transactional integrity, Postgres wins.",
          },
        ],
      },
      {
        content:
          "Just finished dockerizing our full-stack MERN application with Docker Compose and Nginx reverse proxy! Uploaded the production multi-stage Dockerfile and README under DevOps category. Feedback is warmly welcomed! 🐳📦",
        image_url: "",
        user_id: u0,
        likes: [u1, u3],
        comments: [
          {
            user_id: u3,
            text: "Multi-stage builds are such a game changer for shrinking container images down from 1GB to under 90MB.",
          },
        ],
      },
    ];

    const insertedPosts = await Post.insertMany(postsData);
    console.log(`🎉 Successfully seeded ${insertedPosts.length} community posts!`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedCommunityPosts();
