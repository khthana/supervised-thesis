const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// const expressValidator = require("express-validator");
const config = require("./config/env");
// const nodeMode = require("./utils/modeCheck");
const course = require("./routes/courseRoute");
const authRoutes = require("./routes/authRoutes");
const communityRoutes = require("./routes/communityRoutes");
const path = require("path");
const cron = require("node-cron");
const { deleteOldUserDbs } = require("./services/courseService");

const env = config.env;
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "http://localhost:3000"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);

app.use(morgan("dev"));

app.get("/", async (req, res) => {
  res.send("welcome to sql tutor");
});

app.use("/api/auth", authRoutes);
app.use("/api/course", course);
app.use(
  "/uploads/posts",
  express.static(path.join(__dirname, "..", "imgPostContent"))
);
app.use(
  "/uploads/comments",
  express.static(path.join(__dirname, "..", "imgCommentContent"))
);
app.use(
  "/uploads/replies",
  express.static(path.join(__dirname, "..", "imgReplyContent"))
);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/api/community", communityRoutes);
console.log("Static file path:", path.join(__dirname, "uploads"));

app.listen(env.PORT, () => {
  // console.log(`production mode: ${nodeMode.isProd()}`)
  console.log(`server is starting at http://localhost:${env.PORT}`);
  cron.schedule("0 3 * * *", () => {
    console.log("🧹 กำลังลบ SQLite DB เก่าของผู้ใช้...");
    deleteOldUserDbs(1); // 👈 ลบ DB ที่อายุมากกว่า 1 วัน
  });
});
