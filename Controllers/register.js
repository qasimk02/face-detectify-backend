const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body; //Destructuring data which we got from frontend
  if (!name || !email || !password) {
    return res.status(400).json("Incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            entries: 0,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("Unable to register"));

  // database.users.push({
  //     id: '225',
  //     name: name,
  //     email: email,
  //     entries: entries,
  //     joined: new Date()
  // })
  // res.json(database.users[database.users.length-1])
};

module.exports = {
  handleRegister: handleRegister,
};
