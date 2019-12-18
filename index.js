const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

// data source
const { courses } = require("./data.json");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    course(id: Int!): Course
    courses(lang: String): [Course]
  }

  type Mutation
  {
    updateCourse(id: Int!, lang: String!): Course
  }

  type Course
  {
    id:Int,
    title:String,
    author: String,
    language: String,
    url:String
  }
`);

// Functions

let getCourse = args => {
  let id = args.id;
  return courses.filter(course => {
    return course.id == id;
  })[0];
};

let getCourses = args => {
  if (args.lang) {
    console.log("Entro aqui " + args.lang);
    let lang = args.lang;
    return courses.filter(course => course.language === lang);
  } else {
    return courses;
  }
};

let updateCourse = ({ id, lang }) => {
  courses.map(course => {
    if (course.id === id) {
      course.language = lang;
      return course;
    }
  });
  return courses.filter(course => course.id == id)[0];
};

// The root provides a resolver function for each API endpoint
var root = {
  course: getCourse,
  courses: getCourses,
  updateCourse: updateCourse
};

var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
