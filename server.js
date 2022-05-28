const express = require("express"),
  mongoose = require("mongoose"),
  app = express(),
  articleRouter = require("./routes/articles"),
  port = process.env.PORT || 3000,
  Articles = require("./models/article"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`Mongo/Mongoose Connected`);
  })
  .catch((err) => {
    console.log(`Error connecting to DB:`, err.message);
    return process.exit(1);
  });

app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json("application/json"));
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get("/", async (req, res) => {
  const articles = await Articles.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
