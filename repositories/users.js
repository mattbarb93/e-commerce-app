const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);


class UsersRepository extends Repository {
    async create(attributes) {

        // Assumr attributes is always {email: ' ', password: ' '}

        //setting a random ID
        attributes.id = this.randomId();

        //Hashing + salting the passwordss
        const salt = crypto.randomBytes(8).toString('hex');
        const buffer = await scrypt(attributes.password, salt, 64);

        //Creates a new user. Will reopen the file, and update it with newest user. Format { email: 'abc@ggg.com', password: 'abcde' }

        const records = await this.getAll();
        //Take all properties of attributes object, and replace the password inside attributes with the salted one
        const record = ({
            ...attributes,
            password: `${buffer.toString('hex')}.${salt}`
        });

        //Write the updated records array back to this.filename
        records.push(record)

        await this.writeAll(records);

        //Return it so we have access to the user somewhere else
        return record;
    }

    async comparePasswords(saved, supplied) {
        //Saved === Password saved in our DB ]hashed.salt'
        //Supplied === Password given to us by a user trying to sign in

        /*
        const result = saved.split('.');
        const hashed = result[0];
        const sallt = result [1];
        */

        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuf.toString('hex');
    }

}

//So the whole project can use it without needing to create an instance of a class in each new file. 
module.exports = new UsersRepository('users.json');