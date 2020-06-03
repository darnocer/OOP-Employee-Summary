const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

// ** replace ___dirname ?
const OUTPUT_DIR = path.resolve("./templates", "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// ** VALIDATION TESTS - can be done with inquirer?
// - name must be string
// - id must be number
// - email must contain @
// - employees must contain at least 1 mamager
// - employees must contain at least 2 values

// push each employee object to array
let employees = [];

// prompt user for team member info
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Team Member's Name: ",
        name: "name",
      },
      {
        type: "input",
        message: "Team Member's ID: ",
        name: "id",
      },
      {
        type: "input",
        message: "Team Member's Email: ",
        name: "email",
      },
      {
        type: "list",
        message: "Select Team Member's Role: ",
        choices: ["Engineer", "Intern", "Manager"],
        name: "role",
      },
    ])
    .then((response) => {
      // identify role-specific info by role
      switch (response.role) {
        case "Intern":
          response.roleInfo = "school";
          break;
        case "Engineer":
          response.roleInfo = "github";
          break;
        case "Manager":
          response.roleInfo = "office";
          break;
      }
      console.log(response.roleInfo);

      roleQuestions(response);
    });

  const roleQuestions = (employee) => {
    inquirer
      .prompt([
        {
          type: "input",
          message: `Enter Team Member's ${employee.roleInfo}: `,
          name: "roleInput",
        },
        {
          type: "confirm",
          message: "Would you like to add more team members?",
          name: "more",
        },
      ])

      .then((response) => {
        // **  need to access response.roleInfo AND response.more
        // ** response[roleInfo] - roleInfo property is a variable so needs to be accessed via bracket notation
        // ** .then({ roleInfo, more}) was not able to pass roleInfo (undefined)

        let newMember;

        // ** make this DRY - can "Intern", "Manager", "Engineer" be replaced with 'role'
        switch (employee.role) {
          case "Intern":
            newMember = new Intern(
              employee.name,
              employee.id,
              employee.email,
              response.roleInput
            );
            break;
          case "Manager":
            newMember = new Manager(
              employee.name,
              employee.id,
              employee.email,
              response.roleInput
            );
            break;
          case "Engineer":
            newMember = new Engineer(
              employee.name,
              employee.id,
              employee.email,
              response.roleInput
            );
            break;
        }

        employees.push(newMember);

        if (response.more === true) {
          promptUser();
        } else {
          buildTeam();
        }
      });
  };
};

function buildTeam() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, render(employees), "utf-8");
}

promptUser();

// Helpful Hints for Unit 10 Homework:
// The app.js file includes a set of require and declaration statements. You'll want to use all of these for the project.
// in the lib folder you'll find a fully completed htmlRenderer script, it exports a function: render() which will take in an array of employees and return an html page for you. You'll want to write that file somewhere...
// Use the test folder to develop your lib folder, but make sure that you keep your inquirers to app.js

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
