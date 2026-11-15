import type { Dirent } from "node:fs";

type DirentType = "directory" | "file" | "simbolic-Link";


export class FileNode{
    children:FileNode[] = [];
    path:string;
    entry: Dirent | null;
    constructor(path:string, entry:Dirent|null){
        this.path = path;
        this.entry = entry;
    }

    public isRoot():boolean{
        return this.entry === null;
    }

    public add(child:Dirent):FileNode{
        const childNode = new FileNode(`${child.name}`, child);
        this.children.push(childNode);
        return childNode;
    }

    public isDir():boolean{
        return this.entry === null || this.entry.isDirectory(); 
    }

    public isFile():boolean{
        return this.entry !== null && this.entry.isFile(); 
    }

    public nodeType(): DirentType{
         if(this.isDir()) return "directory";
         else if (this.isFile()) return "file";
         else return "simbolic-Link";
    }

}


class FileTree {
    root: FileNode;

    constructor(rootPath: string) {
        this.root = new FileNode(rootPath, null);
    }

    public walk(node: FileNode = this.root, depth = 0): void {
        if(!node.isRoot()){
            const subDirectory = depth > 1;
            const line = "_";
            const space = " ";
            const style = subDirectory ? space.repeat(depth+1) + "|" + line : "|"+line.repeat(depth+1); 
                           
            console.log(
                style, `${node.entry?.name ?? " "+node.path}`
            );
        }
        node.children.forEach(c => this.walk(c, depth + 1));
    }
}


export default FileTree;