const handleSignIn = (db, bcrypt) => (req, res) => {
    const { email, password } = req.body; //Destructuring data which we got from frontend
    if(!email || !password){
        return res.status(400).json("Incorrect form submission")
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', "=", email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json("Unable to get the user"))
            } else {
                res.status(400).json('Wrong credentials')
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
    handleSignIn: handleSignIn
}