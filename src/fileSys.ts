import { readdir} from "node:fs/promises";
import FileTree, { FileNode } from "./tree.js";
import type { Dirent } from "node:fs";

class FileSystem {
	//path of the given directory/file
	private path:string;
	//tree representing the file system of the current directory/file
	private tree:FileTree;
	//This HashMap allows us to insert a nodes in its parent's children list 
	private nodes: Map<string, FileNode> = new Map();
	//List to represent all the subdirectories of the current directory
	public subdirectories:Dirent[] = [];

	constructor(path:string){
		this.path = path;
		this.tree = new FileTree(this.path);
	}

	/** Allows to set a new directory path */
	public async changeDir(path:string):Promise<void>{
		this.path = path;
	}

	/** Reads the subdirectories and inserts them in the list**/
	public async readSubdirectories(){
		this.subdirectories = [];
		const entries = await readdir(this.tree.root.path, { withFileTypes:true})
		for(const entry of entries){
			if(entry.isDirectory()){
			   this.subdirectories.push(entry);
			}
		}
	}

	/** Reads the current directory using recursion and inserts each node
	 *  in the tree */
	public async readDirRecursive():Promise<void>{
		this.tree = new FileTree(this.path);
		this.nodes.clear();

		try{
			this.nodes.set(this.tree.root.path, this.tree.root)
			const entries = await readdir(this.tree.root.path, { withFileTypes: true, recursive:true });
			for (const entry of entries){
				 const parent = this.nodes.get(entry.parentPath);
				 if (!parent) continue; 
        		 const child = parent.add(entry);
        		 this.nodes.set(child.path, child);
			} 
			
		}catch(error){
			console.error(error);
			return 
		}

	}

	/** Calls `toLines()` of the root node return a list of strings 
	 * in which each string represents a file or a folder */
	public treeLines():string[]{
		return this.tree.toLines();
	}

}


export default FileSystem;
