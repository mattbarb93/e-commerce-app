const fs = require('fs');

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
        //Creates a new user. Will reopen the file, and update it with newest user. Format { email: 'abc@ggg.com', password: 'abcde' }

        const records = await this.getAll();
        records.push(attributes);

        //Write the updated records array back to this.filename

        await fs.promises.writeFile(this.filename, JSON.stringify(records))
    }

}

const test = async() => {
    const repo = new UsersRepository('users.json');

    repo.create({email: 'test@test.com', password: 'password'});
    const users = await repo.getAll();

    console.log(users);
}

test();
