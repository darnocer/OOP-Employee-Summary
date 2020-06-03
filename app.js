const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve("./", "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// push each employee object to array
let employees = [];
let managerSelected = false;

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
        validate: function (input) {
          if (isNaN(input)) {
            return "ID must be a number";
          } else {
            return true;
          }
        },
      },
      {
        type: "input",
        message: "Team Member's Email: ",
        name: "email",
        validate: function (input) {
          if (!input.includes("@")) {
            return "Please enter a valid email address";
          } else {
            return true;
          }
        },
      },
      {
        type: "list",
        message: "Select Team Member's Role: ",
        choices: ["Manager", "Engineer", "Intern"],
        name: "role",
      },
    ])
    .then((response) => {
      // identify role-specific info by role; add roleInfo property to obj
      switch (response.role) {
        case "Intern":
          response.roleInfo = "school";
          break;
        case "Engineer":
          response.roleInfo = "github";
          break;
        case "Manager":
          response.roleInfo = "office";

          // used to prompt user for manager if false
          managerSelected = true;
          break;
      }

      // prompt use for additional question based on role
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
        let newMember;

        // use correct constructor obj by role
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

        // add employee obj to employees array
        employees.push(newMember);

        // restart prompt if user indicates they would like to add more users, if there is no manager, if at least one additional employee is not added. Otherwise, create team.html
        if (response.more === true) {
          promptUser();
        } else if (response.more === false && managerSelected === false) {
          console.log("> Must enter at least one manager");
          promptUser();
        } else if (response.more === false && employees.length < 2) {
          console.log("> Must enter at least one employee");
          promptUser();
        } else {
          buildTeam();
          console.log("team.html created successfully!");
        }
      });
  };
};

// write html file created by render function to filepath
function buildTeam() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
  fs.writeFileSync(outputPath, render(employees), "utf-8");
}

// run program
promptUser();
