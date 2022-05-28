const mongoose = require("mongoose"),
  marked = require("marked"),
  slugify = require("slugify"),
  createDomPurify = require("dompurify"),
  jsdom = require("jsdom"),
  { JSDOM } = jsdom,
  dompurify = createDomPurify(new JSDOM().window);
//we are going to create a schema

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHTML: {
    type: String,
    required: true,
  },
});

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHTML = dompurify.sanitize(marked(this.markdown));
    //converts markdown to html and purifies it.
  }
  next();
});

//.then(() => {
//   console.log(`Validation successful`);
// }).catch((err) => {
//   console.log(`Validation error!!`, err.message);
//   return process.exit(1);
// });

//this function is run to validate our article before we perform a CRUD operation on it.
//we can create a slug from our title, everytime we validate a model.

articleSchema.pre("save", function () {
  // In 'save' middleware, `this` is the document being saved.
  console.log(`This is printing before saving: \n name: ${this.title}`);
});
articleSchema.post("save", function () {
  console.log(this.title + ": Saved succesfully");
});

module.exports = mongoose.model("Article", articleSchema);
