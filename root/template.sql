-- Drop tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS authors CASCADE;
DROP TABLE IF EXISTS auth CASCADE;
DROP TABLE IF EXISTS holds CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;

-- Create 'users' 
CREATE TABLE users (
    user_id serial PRIMARY KEY,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email varchar(100) NOT NULL,
    username varchar(50) NOT NULL,
    password varchar(100) NOT NULL,
    phone_number varchar(20) NOT NULL,
    address varchar(100) NOT NULL,
    city varchar(50) NOT NULL,
    state varchar(2) NOT NULL,
    zip_code integer NOT NULL,
    date_of_birth date
);

-- Create a unique index on lowercase email with case-insensitive collation
CREATE UNIQUE INDEX unique_email_lower_ci ON users (LOWER(email) COLLATE "C");


-- Create a unique index on lowercase username with case-insensitive collation
CREATE UNIQUE INDEX unique_username_lower_ci ON users (LOWER(username) COLLATE "C");

-- Create 'branches'
CREATE TABLE branches (
    branch_id serial PRIMARY KEY,
    name varchar(100),
    address varchar(100),
    city varchar(100),
    state varchar(2),
    zip_code integer,
    contact_number varchar(20)
);

-- Create 'authors'
CREATE TABLE authors (
    author_id serial PRIMARY KEY,
    name varchar(100)
);

-- Create 'books'
CREATE TABLE books (
    book_id serial PRIMARY KEY,
    title varchar(250),
    author_id integer REFERENCES authors(author_id) ON DELETE CASCADE,
    branch_id integer REFERENCES branches(branch_id) ON DELETE CASCADE,
    language_text varchar(100),
    isbn varchar(15),
    pages integer,
    image text,
    is_available boolean
);

-- Create  'loans'
CREATE TABLE loans (
    loan_id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
    book_id integer REFERENCES books(book_id) ON DELETE CASCADE,
    branch_id integer REFERENCES branches(branch_id) ON DELETE CASCADE,
    loan_date timestamptz DEFAULT timezone('EST', current_timestamp),
    due_date timestamptz DEFAULT timezone('EST', current_timestamp),
    return_start_date timestamptz,
    return_end_date timestamptz DEFAULT timezone('EST', current_timestamp),
    is_late boolean,
    is_returned boolean
);

-- Create 'fees'
CREATE TABLE fees (
    fee_id serial PRIMARY KEY,
    loan_id integer REFERENCES loans(loan_id) ON DELETE CASCADE,
    fee_amount decimal(10, 2),
    date_assessed date,
    is_paid boolean
);

-- Create  'holds'
CREATE TABLE holds (
    hold_id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
    book_id integer REFERENCES books(book_id) ON DELETE CASCADE,
    hold_date timestamptz DEFAULT timezone('EST', current_timestamp),
    hold_end_date timestamptz
);

-- Create 'reviews'
CREATE TABLE reviews (
    review_id serial PRIMARY KEY,
    user_id integer REFERENCES users(user_id) ON DELETE CASCADE,
    book_id integer REFERENCES books(book_id) ON DELETE CASCADE,
    rating integer,
    review text
);

 -- Create function for trigger
CREATE OR REPLACE FUNCTION set_due_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the due date based on the loan date +  30 days
    NEW.due_date := NEW.loan_date + interval '30 days';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_due_date_trigger
BEFORE INSERT ON loans
FOR EACH ROW
EXECUTE FUNCTION set_due_date();

-- Create or replace the return_end_date function
CREATE OR REPLACE FUNCTION update_return_end_date()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate the return_end_date based on the return_start_date + 7 days
    NEW.return_end_date := (NEW.return_start_date AT TIME ZONE 'EST') + INTERVAL '7 days';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger so that it will occur before insert statment or update statement
CREATE TRIGGER update_return_end_date_trigger
BEFORE INSERT OR UPDATE OF return_start_date ON loans
FOR EACH ROW
EXECUTE FUNCTION update_return_end_date();

-- Insert values into the 'branches' table
INSERT INTO branches (name, address, city, state, zip_code, contact_number)
VALUES
    ('Central Library', '123 Main St', 'Atlanta', 'GA', 30301, '555-1234'),
    ('North Branch', '456 Elm St', 'Atlanta', 'GA', 30302, '555-5678'),
    ('Westside Library', '789 Oak St', 'Atlanta', 'GA', 30303, '555-9101'),
    ('East End Branch', '321 Pine St', 'Atlanta', 'GA', 30304, '555-555-1213'),
    ('South Library', '654 Maple Ave', 'Atlanta', 'GA', 30305, '555-555-1415'),
    ('Downtown Branch', '987 Cedar Rd', 'Atlanta', 'GA', 30306, '555-555-1617'),
    ('West End Library', '654 Oak St', 'Atlanta', 'GA', 30307, '555-555-1819'),
    ('Northwest Branch', '321 Pine St', 'Atlanta', 'GA', 30308, '555-555-2021'),
    ('Southside Library', '789 Elm St', 'Atlanta', 'GA', 30309, '555-555-2223'),
    ('Eastside Branch', '123 Cedar Rd', 'Atlanta', 'GA', 30310, '555-555-2425');

INSERT INTO users (first_name, last_name, username, password, email, phone_number, address, city, state, zip_code, date_of_birth)
VALUES
    ('John', 'Doe', 'johndoe', 'pass123', 'john@example.com', '555-555-1111', '321 Elm St', 'Atlanta', 'GA', 30301, '1990-05-15'),
    ('Jane', 'Smith', 'janesmith', 'smith456', 'jane@example.com', '555-555-2222', '456 Oak St', 'Atlanta', 'GA', 30302, '1988-09-22'),
    ('Michael', 'Johnson', 'michaelj', 'johnson789', 'michael@example.com', '555-555-3333', '789 Pine St', 'Atlanta', 'GA', 30303, '1992-07-10'),
    ('Emily', 'Williams', 'emilyw', 'williams444', 'emily@example.com', '555-555-4444', '987 Maple Ave', 'Atlanta', 'GA', 30304, '1995-03-28'),
    ('Daniel', 'Brown', 'danielbrown', 'brown555', 'daniel@example.com', '555-555-5555', '654 Cedar Rd', 'Atlanta', 'GA', 30305, '1991-11-05'),
    ('Olivia', 'Jones', 'oliviaj', 'jones666', 'olivia@example.com', '555-555-6666', '123 Elm St', 'Atlanta', 'GA', 30306, '1994-01-17'),
    ('Sophia', 'Davis', 'sophiad', 'davis777', 'sophia@example.com', '555-555-7777', '789 Oak St', 'Atlanta', 'GA', 30307, '1989-08-02'),
    ('James', 'Miller', 'jamesm', 'miller888', 'james@example.com', '555-555-8888', '987 Pine St', 'Atlanta', 'GA', 30308, '1993-12-12'),
    ('Emma', 'Wilson', 'emmaw', 'wilson999', 'emma@example.com', '555-555-9999', '654 Maple Ave', 'Atlanta', 'GA', 30309, '1996-06-30'),
    ('Alexander', 'Taylor', 'alextaylor', 'taylor000', 'alexander@example.com', '555-555-0000', '123 Cedar Rd', 'Atlanta', 'GA', 30310, '1990-04-08');

INSERT INTO authors (name)
VALUES
  ('Jacqueline Woodson'),
  ('Harper Lee'),
  ('Lewis Carroll'),
  ('Jane Austen'),
  ('Kazuo Ishiguro'),
  ('R. J. Palacio'),
  ('F. Scott Fitzgerald'),
  ('Suzanne Collins'),
  ('J.K. Rowling'),
  ('George Orwell'),
  ('Ernest Hemingway'),
  ('Agatha Christie'),
  ('Leo Tolstoy'),
  ('Mark Twain'),
  ('Fyodor Dostoevsky'),
  ('Arthur Conan Doyle'),
  ('Charles Dickens'),
  ('William Shakespeare'),
  ('Brit Bennett');

INSERT INTO books (title, author_id, branch_id, language_text, isbn, pages, image, is_available)
VALUES
  ('The Vanishing Act: A Novel', 1, 1, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 1, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 2, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 2, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 3, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 4, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('The Vanishing Act: A Novel', 1, 5, 'en', '9780393062922', 224, 'https://images.isbndb.com/covers/29/22/9780393062922.jpg', true),
  ('To Kill a Mockingbird', 2, 1, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 1, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 1, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 1, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 2, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 2, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 2, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 3, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 3, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 4, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 5, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('To Kill a Mockingbird', 2, 6, 'en', '9780812416800', 281, 'https://images.isbndb.com/covers/68/00/9780812416800.jpg', true),
  ('Alice''s Adventures in Wonderland', 3, 1, 'en', '1503222683', 70, 'https://images.isbndb.com/covers/26/87/9781503222687.jpg', true),
  ('Pride and Prejudice', 4, 2, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 1, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 1, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 2, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 5, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 7, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 8, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Pride and Prejudice', 4, 2, 'en', '0141439513', 480, 'https://images.isbndb.com/covers/95/18/9780141439518.jpg', true),
  ('Klara and the Sun', 5, 1, 'en', '0571364888', 320, 'https://images.isbndb.com/covers/48/86/9780571364886.jpg', true),
  ('Klara and the Sun', 5, 2, 'en', '0571364888', 320, 'https://images.isbndb.com/covers/48/86/9780571364886.jpg', true),
  ('Klara and the Sun', 5, 3, 'en', '0571364888', 320, 'https://images.isbndb.com/covers/48/86/9780571364886.jpg', true),
  ('Klara and the Sun', 5, 5, 'en', '0571364888', 320, 'https://images.isbndb.com/covers/48/86/9780571364886.jpg', true),
  ('Klara and the Sun', 5, 4, 'en', '0571364888', 320, 'https://images.isbndb.com/covers/48/86/9780571364886.jpg', true),
  ('Wonder', 6, 1, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 4, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 4, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 2, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 3, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 6, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 4, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('Wonder', 6, 7, 'en', '0375969020', 320, 'https://images.isbndb.com/covers/90/27/9780375969027.jpg', true),
  ('The Great Gatsby', 7, 5, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 4, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 5, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 4, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 5, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 6, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 1, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Great Gatsby', 7, 1, 'en', '0743273567', 180, 'https://images.isbndb.com/covers/35/65/9780743273565.jpg', true),
  ('The Hunger Games (Book 1)', 8, 6, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('The Hunger Games (Book 1)', 8, 2, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('The Hunger Games (Book 1)', 8, 6, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('The Hunger Games (Book 1)', 8, 3, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('The Hunger Games (Book 1)', 8, 2, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('The Hunger Games (Book 1)', 8, 1, 'en', '0439023521', 384, 'https://images.isbndb.com/covers/35/28/9780439023528.jpg', true),
  ('Harry Potter and the Sorcerer''s Stone', 9, 3, 'en', '9780590353427', 320, 'https://images.isbndb.com/covers/03/42/9780590353427.jpg', true),
  ('1984', 10, 4, 'en', '9780451524935', 328, 'https://images.isbndb.com/covers/49/35/9780451524935.jpg', true),
  ('The Old Man and the Sea', 11, 5, 'en', '0684801221', 128, 'https://images.isbndb.com/covers/12/23/9780684801223.jpg', true),
  ('Murder on the Orient Express', 12, 6, 'en', '9780062073495', 274, 'https://images.isbndb.com/covers/34/95/9780062073495.jpg', true),
  ('Crime and Punishment', 15, 9, 'en', '9780486415871', 430, 'https://images.isbndb.com/covers/58/71/9780486415871.jpg', true),
  ('The Adventures of Sherlock Holmes', 16, 10, 'en', '9780553212419', 256, 'https://images.isbndb.com/covers/24/19/9780553212419.jpg', true),
  ('Great Expectations', 17, 1, 'en', '9780141439563', 544, 'https://images.isbndb.com/covers/95/63/9780141439563.jpg', true),
  ('Hamlet', 18, 2, 'en', '1981020705', 132, 'https://images.isbndb.com/covers/07/06/9781981020706.jpg', true),
  ('The Vanishing Half', 19, 2, 'en', '0525536965', 400, 'https://images.isbndb.com/covers/69/63/9780525536963.jpg', true);
