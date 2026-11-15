import readLine from "node:readline";
const {stdin, stdout} = process;

type Key = {
    name: string;
    ctrl: boolean;
}

export default class Input{

    constructor(){
        readLine.emitKeypressEvents(stdin);
    }

    public select(options: string[], title:string, lines:string[]):Promise<string | null>{
        if(options.length === 0){
            return Promise.resolve(null);
        }

        if(!stdin.isTTY){
            return Promise.reject(
                new Error("This program requires an interactive terminal")
            );
        }

        return new Promise((resolve) => {
            let selected = 0;

            const render = () => {
            	stdout.write("\x1b[2J\x1b[H");
                stdout.write(`\n${title}\n\n`);
                stdout.write("======= CONTENT =======");
                lines.forEach(line => stdout.write(`\n${line}`));
                stdout.write(`\n\n[ OPEN ]\n`)
                options.forEach((option, i) => {
                    stdout.write(`${i === selected ? "=> " : " "}${option}\n`);
                });
                stdout.write("\nUse <Arrow Up> / <Arrow Down> and <Enter> to select ");
                stdout.write("\nPress <Ctrl + C> or <Q> to exit the program\n");
            }

            const cleanUp = () => {
                stdin.off("keypress", onKeypress);
                if (stdin.isTTY){
                    stdin.setRawMode(false);
                }
            }

            const onKeypress = (input:string, key:Key) => {
                if(key.ctrl && key.name === "c" || key.name === "q" || key.name === "escape"){
                    cleanUp();
                    resolve(null);
                    process.exit();
                }

                if(key.name === "up" || key.name === "down"){
                    selected = (selected - (key.name === "up" ? (1) : (-1)) + options.length) % options.length;
                    render();
                }else if(key.name === "return"){
                    const choice = options[selected];
                    cleanUp();
                    resolve(choice ?? null);
                }
            };

            stdin.setRawMode(true);
            stdin.resume();
            stdin.on("keypress", onKeypress)
            render();
        });
    }

}
