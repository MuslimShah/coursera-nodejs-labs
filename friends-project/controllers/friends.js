const fs = require('fs');
let friends = {};


//check for friends.txt
if (!(fs.existsSync('./data/friends.txt'))) {
    fs.writeFileSync('./data/friends.txt', '{}', 'utf-8');
} else {
    //reads the data of stored users from file and store it in user var
    friends = JSON.parse(fs.readFileSync('./data/friends.txt'));
}
//get all friends
exports.getFreind = (req, res, next) => {
        const keys = Object.keys(friends).length;
        if (keys > 0) {
            return res.json({ friends: JSON.stringify(friends) })
        } else {
            res.json({ msg: "no friends in the list " })
        }
    }
    //gets friend by specified email id
exports.getByEmail = (req, res, next) => {
        if (req.params.email) {
            const found = friends[req.params.email];
            res.json({ found })
        }
    }
    //add new friend
exports.addNewFriend = (req, res, next) => {
        // console.log(req.body);
        if (req.body.email) {

            friends[req.body.email] = {
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "DOB": req.body.DOB
            }
            console.log(friends);
            fs.writeFileSync('./data/friends.txt', JSON.stringify(friends), 'utf-8');
            return res.json({ msg: `The user ${req.body.firstName} has been successfully added` })
        }
        res.json({ msg: "enter valid data" })
    }
    //update details of friend
exports.updateFriend = (req, res, next) => {
    const email = req.params.email;
    if (email) {
        const friend = friends[req.params.email];
        if (friend) {
            let DOB = req.body.DOB;
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            friend.DOB = DOB;
            friend.firstName = firstName;
            friend.lastName = lastName;
            friends[email] = friend; // store updated friend back into friends object
            fs.writeFileSync('./data/friends.txt', JSON.stringify(friends), 'utf-8');
            res.json({ msg: `User ${email} updated successfully` });
        }
    }
}

//delete a friend by email
exports.deleteByEmail = (req, res, next) => {
    const email = req.params.email;
    if (email) {
        const friend = friends[email];
        if (friend) {
            delete friends[email];
            fs.writeFileSync('./data/friends.txt', JSON.stringify(friends), 'utf-8')
            res.json({ msg: `user with  email${email} has been removed` })
        }
    }
}