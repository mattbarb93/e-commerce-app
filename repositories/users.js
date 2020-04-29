const fs = require('fs');
const crypto = require('crypto')

class UsersRepository {
    constructor(filename) {
        if (!filename) {
            throw new Error('Creating a repository requires a filename')
        }

        this.filename = filename;
        try{
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

    async create(attributes){

        //setting a random ID
        attributes.id = this.randomId();

        //Creates a new user. Will reopen the file, and update it with newest user. Format { email: 'abc@ggg.com', password: 'abcde' }

        const records = await this.getAll();
        records.push(attributes);

        //Write the updated records array back to this.filename

        await this.writeAll(records);
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

}

const test = async() => {
    const repo = new UsersRepository('users.json');

    
    const user = await repo.getOne('alkdlas');

    console.log(user);
}

test();
