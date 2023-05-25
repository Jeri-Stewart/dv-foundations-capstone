require("dotenv").config();
const { CONNECTION_STRING } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

// Define the 'users' model
const User = sequelize.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    timestamps: false, // Disable automatic timestamps
    indexes: [
      {
        unique: true,
        fields: [Sequelize.fn("lower", Sequelize.col("email"))],
        collate: "C",
      },
      {
        unique: true,
        fields: [Sequelize.fn("lower", Sequelize.col("username"))],
        collate: "C",
      },
    ],
  }
);

const Book = sequelize.define(
  "Book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "authors",
        key: "author_id",
        onDelete: "CASCADE",
      },
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "branches",
        key: "branch_id",
        onDelete: "CASCADE",
      },
    },
    language_text: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "books",
    timestamps: false, // If you don't have timestamp fields in the table
  }
);

// Define the 'loans' model
const Loan = sequelize.define(
  "loan",
  {
    loan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onDelete: "CASCADE",
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "book_id",
      },
      onDelete: "CASCADE",
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "branches",
        key: "branch_id",
      },
      onDelete: "CASCADE",
    },
    loan_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("timezone('EST', current_timestamp)"),
    },
    due_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("timezone('EST', current_timestamp)"),
    },
    return_start_date: {
      type: DataTypes.DATE,
    },
    return_end_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("timezone('EST', current_timestamp)"),
    },
    is_late: {
      type: DataTypes.BOOLEAN,
    },
    is_returned: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    tableName: "loans",
    timestamps: false, // If you don't want Sequelize to manage the createdAt and updatedAt fields
  }
);

const Branch = sequelize.define(
  "Branch",
  {
    branch_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    zip_code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    contact_number: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
  },
  {
    tableName: "branches",
    timestamps: false, // no created_at and updated_at cols
  }
);

// Export the 'User' model
module.exports = { User, Book, Loan, Branch };
