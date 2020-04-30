const fs = require('fs');
const crypto = require('crypto')
const util = require('util')

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename)
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {

        return JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));

        /*
        Breaking down what's happening above

        // Open the file called this.filename
        const contents = await fs.promises.readFile(this.filename, { 
            encoding: 'utf8'
        });
        // Read its contents
        console.log(contents);

        // Parse the contents
        const data = JSON.parse(contents);

        // Return the parsed data
        return data;

        */

    }

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

    async writeAll(records) {
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2))
        //null doesnt do any custom formatting
        //2 changes the indentation of the string. with every level of nesting, you get 2 spaces.

    }

    randomId() {
        //Generates 4 bytes of data, and converts it to a string in hex format. Call function every time you need a random ID.
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();

        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();

        //For each record, return TRUE if it's not ID that you passed.
        const filteredRecords = records.filter(record => record.id !== id);

        //Now, pass it back to the records file
        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        //Get all users, then find the one you want to update
        const records = await this.getAll()
        const record = records.find(record => record.id === id)

        //If you didnt find the record you wish, throw error
        if (!record) {
            throw new Error(`Record with id ${id} not found`)
        }

        // record === {email: 'test@test.com}
        //attributes === {password: 'mypassword'}
        Object.assign(record, attributes);
        // after running it -> record {email: 'test@test.com, password: 'mypassword'}
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        //iterate over all the key value pairs of the filters object

        //Outside for loop, you iterate through the array

        //The inner for loop, you iterate through an object.
        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }


}

//So the whole project can use it without needing to create an instance of a class in each new file. 
module.exports = new UsersRepository('users.json');