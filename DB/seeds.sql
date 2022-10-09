INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Finance"),
       ("Engineering"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Associate", 3222, 1),
       ("Senior Sales Associate", 5000, 1),
       ("Sales Manager", 2599, 1),
       ("Software Engineer", 5500, 5),
       ("Software Engineer II", 2599, 5),
       ("Lead Software Engineer", 5400, 5),
       ("Software Manager", 5000, 5),
       ("Accountant", 5500, 3),
       ("Clerk", 1000, 3),
       ("Attorney", 5500, 4),
       ("Lead Attorney", 2599, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_name)
VALUES ("Stephanie", "Tyson", 1, "Stacy Donald"),
       ("Ashley", "Martinez", 5, "Stacy Donald"),
       ("Stacy", "Donald", 3, "N/A"),
       ("Kevin", "Tupik", 4, "Ahmad Muhammed"),
       ("Ahmad", "Muhammed", 7, "N/A"),
       ("Courtney", "Bleu", 8, "N/A"),
       ("Rebecca", "Gianna", 10, "Thomas Gifford"),
       ("Thomas" , "Gifford", 11, "N/A");

