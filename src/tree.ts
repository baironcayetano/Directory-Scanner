import type { Dirent } from "node:fs";
import path from "node:path";

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
        const childPath = path.join(child.parentPath, child.name);
        const childNode = new FileNode(childPath, child);
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

    public toLines(node: FileNode = this.root, depth = 0, lines: string[] = []): string[] {
        //stop at depth = 2
        if(depth > 2){
            return lines;
        }

        if(!node.isRoot()){
            const SPACE = " ";
            const indent = SPACE.repeat(depth);
            lines.push(`${indent}|_${node.entry?.name ?? node.path}`);
        }

        node.children.forEach(child => {this.toLines(child, depth + 1, lines)});
        return lines;
    }
}


export default FileTree;