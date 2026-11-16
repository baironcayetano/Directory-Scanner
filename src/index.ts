import path from "node:path";
import FileSystem from "./fileSys.js";
import Input from "./input.js";

class Main {
    /** Configuration */
    public static async init(): Promise<void> {
        //controller for terminal interaction
        const input = new Input();
        //uses the current working directory as `dir`
        let dir = process.cwd();
    
        const fileSystem = new FileSystem(dir);

        //Set to true so that the program does not stop
        //until the terminal controller receives a "Control+c" or "q"
        //in the keyboard event
        while (true) {
            await fileSystem.changeDir(dir);
            await fileSystem.readDirRecursive();
            await fileSystem.readSubdirectories();

            //This parent option allows the user to navigate to the
            // parent directory of the current directory
            const parentOption = `.. ${path.dirname(dir)}`;
            //creates a list of options so that the user can navigate
            //thorugh the directory
            const options = [
                ...(path.dirname(dir) !== dir ? [parentOption] : []),
                ...fileSystem.subdirectories.map((entry) => entry.name),
            ];

            //prints the choices and gets the choice of the user
            const choice = await input.select(
                options, 
                `Current Folder: ${dir}`, 
                fileSystem.treeLines()
            );
            
            //when true, change the dir path to the parent's dir path
            if (choice === parentOption) {
                dir = path.dirname(dir);
                continue;
            }

            //change the dir path
            else if(choice){
                dir = path.resolve(dir, choice);
            }
            
        }
    }
}

Main.init();
