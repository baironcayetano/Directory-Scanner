import type { Dirent } from "node:fs";
import path from "node:path";

/** This is a Tree Node and represents a File or a directory.
 *  It stores the File or directory name and path in the entry member variable
 *  When the node represents a directoy, it will store the subdirectories and its files 
 *  in the children member variable.
 */
export class FileNode{
    //List of child nodes
    public children:FileNode[] = [];
    //folder/file path
    public path:string;
    //node content. null when the entry is not provided
    public entry: Dirent | null = null;

    constructor(path:string, entry:Dirent|null){
        this.path = path;
        this.entry = entry;
    }

    /** Returns `true` when the node represents a root node and `false` when it does not. */
    public isRoot():boolean{
        return this.entry === null;
    }

    /** Adds a new child node to the member variable named `children`*/
    public add(child:Dirent):FileNode{
        const childPath = path.join(child.parentPath, child.name);
        const childNode = new FileNode(childPath, child);
        this.children.push(childNode);
        return childNode;
    }

}


/** This Tree handle all the operations to show and to store the information about
 *  the file system of the given directory.
 *  It uses FileNode(s) to store information about a directory
 */
class FileTree {
    //Root Node
    root: FileNode;

    constructor(rootPath: string) {
        //Creates a root node using the given path
        this.root = new FileNode(rootPath, null);
    }

    /** Walks through the tree and displays the files and folders of the given node
     *  Then, using recursion stores all the file and folder names in a dinamic list.
     *  - When the node param is not provided, it uses the root node. 
     *  - When the depth is not provided, it starts at 0.
     *  - When an array is not provided in the lines parameter, it uses an empty array.
     * 
     *  `NOTE`: This method will only return a list with the files and folders with a maximum depth of 2.
     *  This means that only folders and subfolders will be inserted in the list. Any subfolder's subfolder will not be inserted.
     */
    public toLines(node: FileNode = this.root, depth = 0, lines: string[] = []): string[] {
        //stops at depth = 2
        //This helps to avoid showing too many subfolders and subfiles.
        if(depth > 2){
            return lines;
        }

        //adding identation
        if(!node.isRoot()){
            const SPACE = " ";
            const indent = SPACE.repeat(depth);
            lines.push(`${indent}|_${node.entry?.name ?? node.path}`);
        }

        //recursion
        node.children.forEach(child => {this.toLines(child, depth + 1, lines)});
        return lines;
    }
}


export default FileTree;