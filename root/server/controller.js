require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const moment = require('moment');


// you wouldn't want to rejectUnauthorized in a production app, but it's great for practice
const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const { User, Book, Loan, Branch } = require("./models.js");

module.exports = {
  getMain: (req, res) => {
    res.render("index", { messages: req.flash() });
  },
  getHome: (req, res) => {
    const user = req.session.user;
    res.render("home", { user: user });
  },
  getCatalog: async (req, res) => {
    //console.log("Before");
    try {
      const user = req.session.user;
      if (!req.query.bookName) {
        // Render the services page
        const user = req.session.user;
        res.render("catalog", { user: user });
        //console.log("Two");
      } else {
        let books = []; // create empty arr to store books
        //console.log("Three");
        if (req.query.bookName) {
          const title = req.query.bookName;
          //console.log(title);
          //console.log("Four");
          // Execute the search query
          const query = `
            SELECT books.book_id, books.title, books.is_available, books.image, branches.name AS branch_name, authors.name
            FROM books
            JOIN branches ON books.branch_id = branches.branch_id
            JOIN authors ON books.author_id = authors.author_id
            WHERE books.title ILIKE $1
              AND books.is_available = true
`;
          //console.log("five");

          const searchTitle = `%${title}%`;
          //console.log(searchTitle);
          //console.log("six");
          // Execute the query
          const result = await sequelize.query(query, {
            bind: [searchTitle],
            type: Sequelize.QueryTypes.SELECT,
          });
          //console.log("seven");
          console.log(result);

          //console.log("eight");
          books = result;
          //console.log("nine");
          //console.log(books);

          if (books.length > 0) {
            console.log("arr with length");
            console.log(books);
            res.status(200).json(books);
          } else {
            console.log("empty arr");
            // case where no books are found
            res.render("catalog", { user: user, data: null });
          }
          // console.log("final");
        }
      }
    } catch (error) {
      console.error("Error executing searchCatalog:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getReturns: async (req, res) => {
    console.log("one");
    const user = req.session.user;
    console.log(user);
    let { email } = user;
    console.log(email);
    let loans = await sequelize.query(
      `
      SELECT users.email, users.username, books.title AS book_title, books.image, authors.name AS author_name, loans.due_date
      FROM loans
      JOIN users ON loans.user_id = users.user_id
      JOIN books ON loans.book_id = books.book_id
      JOIN authors ON books.author_id = authors.author_id
      WHERE users.email = $1
    `,
      {
        type: sequelize.QueryTypes.SELECT,
        bind: [email],
      }
    );
    console.log("two");
    if (loans.length > 0) {
      console.log("arr with length");
      console.log(loans);
      res.render("returns", { user: user, loans: loans, moment: moment });
    } else {
      console.log("empty arr");
      // case where no books are found
      res.render("returns", { user: user, loans: loans, moment: moment });

    }
  },
  sign: async (req, res) => {
    let { username, email, password } = req.body;
    console.log({ username, email, password });
    if (username === "" && email && password) {
      try {
        // Find the user with the provided email
        let query = await sequelize.query(
          //query is an arr, index first ele of arr
          `select username, email, password
          from users 
          where email = '${email}'`
        );
        let arr = query[0];
        let user = arr[0];
        console.log(query);

        //compare inputs to database
        if (
          email != user.email ||
          !(await bcrypt.compare(password, user.password))
        ) {
          res.status(401).send("Invalid email or password");
          return;
        } else {
          // Redirect the user to the home page
          req.session.user = user;
          res.redirect(302, "/user/home");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("Failed to Sign In");
      }
    } else {
      let errors = [];
      if (!username || !email || !password) {
        errors.push({ message: "Please enter all required fields" });
      }

      if (password.length < 6) {
        errors.push({ message: "Password must be at least 6 characters" });
      }

      if (errors.length > 0) {
        res.render("index", { errors, messages: req.flash() });
      } else {
        try {
          // Hash the password before storing it in the database
          const hashedPassword = await bcrypt.hash(password, 10);

          // Insert the user data
          const newUser = await User.create({
            first_name: "na",
            last_name: "na",
            email,
            username,
            password: hashedPassword,
            phone_number: "na",
            address: "na",
            city: "na",
            state: "na",
            zip_code: 00000,
          });

          req.flash("success", "Sign Up successful. You can now log in.");
          res.redirect("/");
        } catch (error) {
          console.log(error);
          res.status(500).send("Failed to create a new user.");
        }
      }
    }
  },
  updateLoans: async (req, res) => {
    const { Loan, Book, Branch } = require("./models.js");

    try {
      const { book_id, branch_name, email } = req.body;

      // Get the user_id from the 'users' table based on the provided email
      const user = await User.findOne({ where: { email } });
      const user_id = user.user_id;

      // Get the branch_id from the 'branches' table based on the provided branch_name
      const branch = await Branch.findOne({ where: { name: branch_name } });
      const branch_id = branch.branch_id;

      // Insert the loan data into the 'loans' table
      await Loan.create({
        user_id,
        book_id,
        branch_id,
        loan_date: new Date(),
        due_date: new Date(), // Set the due date as desired
        return_end_date: new Date(), // Set the return end date as desired
        is_late: false,
        is_returned: false,
      });

      // Send a success response
      res.status(200).send({ user: user });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while creating the loan");
    }
  },
  updateBookAvailability: async (req, res) => {
    try {
      const { book_id, is_available } = req.body;
      await Book.update(
        { is_available: is_available },
        { where: { book_id: book_id } }
      );
      const user = req.session.user;
      res.status(200).send({ user: user });
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while updating books");
    }
  },
};
