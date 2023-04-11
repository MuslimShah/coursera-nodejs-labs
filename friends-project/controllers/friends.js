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
        /*
         * Check if there are any friends in the list
         */
        if (keys > 0) {
            /*
             * If there are friends in the list, 
             * return the list of friends as a JSON object
             */
            return res.json({ friends: JSON.stringify(friends) })
        } else {
            /*
             * If there are no friends in the list, 
             * return a JSON object with an error message
             */
            res.json({ msg: "no friends in the list " })
        }
    }
    //gets friend by specified email id
exports.getByEmail = (req, res, next) => {
        // If email parameter exists in req.params, 
        //retrieve friend object associated with the email 
        //from the friends object and send it back as a JSON response
        // to the client using the res.json() method. Assumes friends object 
        //is an object that maps object with given email  addresses to friend objects.

        if (req.params.email) {
            const found = friends[req.params.email];
            res.json({ found })
        }
    }
    //add new friend
exports.addNewFriend = (req, res, next) => {
        /*
        If the email parameter exists in the request body (req.body), a new friend object is created 
        with the first name, last name, and date of birth (DOB) 
        provided in the request body.
         This friend object is added to the friends object, 
         where the email serves as the key and the friend object serves as 
         the value.

        After adding the new friend object to the friends object,
         the updated friends object is written to a file named 'friends.txt' 
         in JSON format using the fs.writeFileSync() method.

        Finally, a success message is sent back to the client as a JSON response 
        using the res.json() method, indicating that the new friend has been successfully added.

        If the email parameter does not exist in the request body, a validation error message is sent 
        back to the client as a JSON response using the res.json() method.
        */

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
    /*
This code first retrieves the 'email' parameter from the request parameters (req.params),
 which represents the email of the friend to be updated.
If the 'email' parameter exists, the function retrieves
 the corresponding friend object from the 'friends' object 
 using the 'email' as the key. 
If the friend object exists, the function updates the 'DOB', 
'firstName', and 'lastName' properties of the friend object 
with the values provided in the request body (req.body).
After updating the friend object, the function stores the updated 
'friends' object to a file named 'friends.txt' using the
 fs.writeFileSync() method.
*/
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
    /*
This code first retrieves the 'email' parameter from the request parameters 
(req.params), which represents the email of the friend to be removed.
If the 'email' parameter exists, the function retrieves the corresponding 
friend object from the 'friends' object using the 'email' as the key. 
If the friend object exists, the function deletes the friend object 
from the 'friends' object using the 'delete' keyword.

After deleting the friend object, the function stores the
 updated 'friends' object to a file named 'friends.txt' 
 using the fs.writeFileSync() method.*/

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