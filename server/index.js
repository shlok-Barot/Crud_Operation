const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root@1234",
  database: "testdemo",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

/// Fetch User data
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM Student";
  db.query(sqlGet, (error, result) => {
    res.send(result);
  });
});

//// Add New User
app.post("/api/add_user", (req, res) => {
  const { FirstName, LastName, Gender, Age, MobileNo, Country } = req.body;
  // const sqlInsert =
  //   "INSERT INTO Student (FirstName, LastName, Gender, Age, MobileNo, Country) VALUES (?, ?, ?, ?, ?, ?)";
  const sqlInsert = "call Add_new_User (?, ?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [FirstName, LastName, Gender, Age, MobileNo, Country],
    (error, result) => {
      if (error) {
        console.log(error);
      }
    }
  );
});

//// Update User data
app.put("/api/update_user/:id", (req, res) => {
  const { id } = req.params;
  const { FirstName, LastName, Gender, Age, MobileNo, Country } = req.body;
  const sqlUpdate =
    "UPDATE Student SET FirstName = ?, LastName = ?, Gender = ?, Age = ?, MobileNo = ?, Country = ? WHERE Id = ?";
  // const sqlUpdate = "call Update_User (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sqlUpdate,
    [FirstName, LastName, Gender, Age, MobileNo, Country, id],
    (error, result) => {
      if (error) {
        console.log(error);
      }
    }
  );
});

/// Remove User
app.delete("/api/remove_user/:id", (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM  Student WHERE Id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
  });
});

app.get("/", (req, res) => {
  // const sqlInsert =
  //   "INSERT INTO Student VALUES ('7','Sagar','Patel','Male','27','8767564875','India')";
  // db.query(sqlInsert, (err, result) => {
  //   console.log(err, "Error");
  //   console.log(result, "Result");
  //   res.send("Hello Shlok");
  // });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
