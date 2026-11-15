import FileSystem from "./fileSys.js";
import Input from "./input.js";

class Main {
    public static async init():Promise<void>{
       const input = new Input();
       
       let exit = false;
       let dir = "./";
       let fileSystem = null;
       while (!exit) {
            console.log("Press <Enter> to chose the current directory");
            console.log("Type <close> or press 'Ctl+C' to close this program")
            const response = (await input.text("Enter directory: ")).trim();

            if(response === "close"){
                exit = true;
                break;
            }

            if(response.length > 0){
                dir = response;
            }

            if(!fileSystem) { fileSystem = new FileSystem(dir); }
            else{ await fileSystem.changeDir(dir); }

            await fileSystem.readDirRecursive();
            fileSystem.displayDirRecursive();
       }

       process.exit();
       //const dir = await input.text("Enter directory: ");
	   //const fileSystem = new FileSystem(dir);
	   //await fileSystem.ReadDir();
       //fileSystem.DisplayDir();

       //input.listenKeyBoard();
		        
    }
}

Main.init();
