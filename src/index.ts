import path from "node:path";
import FileSystem from "./fileSys.js";
import Input from "./input.js";

class Main {
    public static async init(): Promise<void> {
        const input = new Input();
        let dir = process.cwd();
        const fileSystem = new FileSystem(dir);

        while (true) {
            await fileSystem.changeDir(dir);
            await fileSystem.readDirRecursive();
            await fileSystem.readSubdirectories();

            const parentOption = `.. ${path.dirname(dir)}`;
            const options = [
                ...(path.dirname(dir) !== dir ? [parentOption] : []),
                ...fileSystem.subdirectories.map((entry) => entry.name),
            ];

            const choice = await input.select(
                options, 
                `Current Folder: ${dir}`, 
                fileSystem.treeLines()
            );
            
            if (choice === parentOption) {
                dir = path.dirname(dir);
                continue;
            }

            else if(choice){
                dir = path.resolve(dir, choice);
            }
            
        }
    }
}

Main.init();
