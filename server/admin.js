const readline = require('readline');
const { Users } = require('./dataAccessLayer/sequelize'); 
const bcrypt = require('bcrypt');

module.exports = async function() {
    let adminExists = null;
    try {
        adminExists = await Users.findOne({
            where: {
                userClass:2
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


        function getUser() {
            return new Promise( (resolve, rej) => {        
                rl.question('Username:\n', (res) =>{
                    if(res){
                        username = res;
                    }
                    resolve(res);
                });
            })
        }
        await getUser();
        
        rl._writeToOutput = function _writeToOutput(stringToWrite) {
            if (rl.stdoutMuted)
              rl.output.write("");
            else
              rl.output.write(stringToWrite);
          };
        
        rl.stdoutMuted = true;
        function getPassword() {
            return new Promise( (resolve, rej) => {
                console.log("Password:")
                rl.question('', async (password) => {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    try {
                        const admin = await Users.create({
                            username: username,
                            hashedPassword: hashedPassword,
                            userClass: 2,
                            banned: false,
                            email:'test@gmail.com',
                        });
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

          
    }
    return;
}