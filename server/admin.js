const readline = require('readline');
const { Users } = require('./dataAccessLayer/sequelize'); 
const bcrypt = require('bcrypt');

module.exports = async function() {
    let adminExists = null;
    try {
        adminExists = await Users.findOne({
            where: {
                class:2
            }
        })     
    }catch(err){
        console.log("Error searching for existing admin: ", err);
    }
    if(!adminExists){
        console.log("Creating new admin account...");
        let username = 'admin';
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.stdoutMuted = true;

        function getUser() {
            return new Promise( (resolve, rej) => {        
                rl.question('Username:', (res) =>{
                    if(res){
                        username = res;
                    }
                    console.log("Username is: ", res);
                    resolve(res);
                });
            })
        }
        await getUser();
        console.log("Got user");

        function getPassword() {
            return new Promise( (resolve, rej) => {
                rl.question('Password:', async (password) => {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    try {
                        /*const admin = await Users.create({
                            username: username,
                            hashedPassword: hashedPassword,
                            class: 2,
                            banned: false,
                            email:'test@gmail.com',
                        });*/
                        const admin = username;
                        console.log("Successfully created admin account : ", admin.username);
                        resolve(admin);
                    }catch(err){
                        console.log("Error creating account with provided credentials: ", err);
                        rej(err);
                    }
                })
            })
        }

        await getPassword();
        console.log("admin account created! Server is running...");
        rl.close();

        rl._writeToOutput = function _writeToOutput(stringToWrite) {
            if (rl.stdoutMuted)
              rl.output.write("*");
            else
              rl.output.write(stringToWrite);
          };
          
    }else{
        console.log("Admin account already exists");
    }

    return;
}