import readline from "readline/promises";
const {stdin, stdout} = process;


const readLine = readline.createInterface({input:stdin, output:stdout});

class Main {
    public static async init():Promise<void>{
       const name = await readLine.question("What is your name?");
        console.log(`Hello ${name}! Welcome to this project!`)
        console.log("Hello world from typescript");
        process.exit(0);
    }
}

Main.init();