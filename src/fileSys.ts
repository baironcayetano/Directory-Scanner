import { readdir} from "node:fs/promises";
import FileTree, { FileNode } from "./tree.js";
import type { Dirent } from "node:fs";

class FileSystem {
	private path:string;
	private tree:FileTree;
	private nodes: Map<string, FileNode> = new Map();
	public subdirectories:Dirent[] = [];

	constructor(path:string){
		this.path = path;
		this.tree = new FileTree(this.path);
	}

	public async changeDir(path:string):Promise<void>{
		this.path = path;
	}

	public async readSubdirectories(){
		this.subdirectories = [];
		const entries = await readdir(this.tree.root.path, { withFileTypes:true})
		for(const entry of entries){
			if(entry.isDirectory()){
			   this.subdirectories.push(entry);
			}
		}
	}

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

	public treeLines():string[]{
		return this.tree.toLines();
	}

}


export default FileSystem;
