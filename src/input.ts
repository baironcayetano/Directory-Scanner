import readLine from "node:readline";
const {stdin, stdout} = process;

const KeyEventHandler = (_:any, key:any) => {
    if (key.ctrl && key.name === "c") process.exit(); // en modo raw Ctrl+C ya no sale solo
    if (key.name === "q") process.exit();
    //teclas de cursor
    if (key.name === "up") stdout.moveCursor(0,-1); 
    if (key.name === "down") stdout.moveCursor(0, 1);
    if (key.name === "left") stdout.moveCursor(-1, 0);
    if (key.name === "right") stdout.moveCursor(1,0);
    if (key.name === "return") console.log("enter");
}

export default class Input{
    
    controller:readLine.Interface;

    constructor(){
        this.controller = readLine.createInterface({input:stdin, output:stdout});
        readLine.emitKeypressEvents(stdin);
    }

    public text(content: string): Promise<string> {
    return new Promise((resolve) => {
        this.controller.question(content, resolve);
        });
    }

    public listenKeyBoard(onKey?:(_:any,key:string)=>void):void{
        //raw mode
        if(stdin.isTTY){
            stdin.setRawMode(true);
        }

        //add keyboard event
        const handler = onKey || KeyEventHandler;
        stdin.on("keypress", handler);
    }
}
