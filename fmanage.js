/*
	Easy File Manager Master Script
*/

//Remote Connection
var Remote = {
	
	//ID of the iframe containing the remote interface page
	iframeID: "remoteframe",
	
	//Upload status
	uploadStatus: {
		"code": -1,
		"detail": "Loading..."
	},
	
	// Start a file upload.
	// This method opens the file selection dialog.  When the user selects a file, it will be uploaded to the current folder.
	//
	startUpload: function() {
		//Get the document body
		var body = Remote.getRemote();
		//Get the file selector input
		body.getElementById("fileselector").click();
	},
	
	// File upload callback.
	// This method is set as the "onchange" handler for the file selector.  When it changes, a file has been selected, and the upload should begin.
	//
	fileChanged: function() {
		//Get the document body
		var body = Remote.getRemote();
		//Get the path input
		body.getElementById("filepath").value = FBrowser.cpath;
		//Click the submit button
		body.getElementById("submit").click();
	},
	
	// Page loaded callback.
	// This method is called when the remote frame finishes loading.
	//
	remoteLoad: function() {
		//Get the document body
		var body = Remote.getRemote();
		
		//Get the file index
		FBrowser.index = JSON.parse(body.getElementById("index"));
		//Get the upload status code
		Remote.uploadStatus = JSON.parse(body.getElementById("status"));
	},
	
	// Get the Remote Document.
	// Get the body of the iframe used for remote interfacing
	//
	getRemote: function() {
		//Get the iframe
		var frame = document.getElementById(Remote.iframeID);
		//Get the content
		return frame.contentDocument || frame.contentWindow.document;
	}
};

//File Browser
var FBrowser = {
	
	//Current path
	cpath: "",
	
	//Currently selected file
	cfile: "",
	
	//File Index
	index: [],
	
	//Mime info
	mime: {
	//  MIME code	  | Type Name		  | Icon Name
		"directory":	["Directory",		"folder"],
		"image/JPEG":	["JPEG Image",		"application-image"],
		
		//Default entry
		"-default-":	["Uknown Type",		"document"]
	},
	
	//Rebuild the folder tree
	rebuildFolderTree: function() {
		//Log
		console.log("Rebuilding folder tree...");
		//Get the folder tree
		var ftree = document.getElementById("qnav");
		//Delete the contents
		ftree.innerHTML = "";
		//Create a root node
		var rnode = Tree.createNode("Root","home");
		rnode.setAttribute("path","\\");
		ftree.appendChild(rnode);
		//Build the index
		Tree.build(FBrowser.index, rnode, "\\");
	},
	
	//Rebuild the file view
	rebuildFileView: function() {
	},
	
	//Rebuild file information
	rebuildFileInfo: function() {
	},
	
	//Fake Index
	fakeIndex: {
		"folder": {
			"mime": "directory",
			"children": {
				"folder-1": {
					"mime": "directory"
				},
				"folder-2": {
					"mime": "directory",
					"children": {
						"image1": {
							"mime": "image/JPEG"
						},
						"image2": {
							"mime": "image/JPEG"
						},
						"image3": {
							"mime": "image/JPEG"
						}
					}
				}
			}
		},
		"folder1": {
			"mime": "directory",
			"children": {
				"folder1-1": {
					"mime": "directory"
				}
			}
		}
	},
	
	//Get MIME info
	getMimeInfo: function(mime) {
		//Get the info
		var info = FBrowser.mime[mime];
		//Check if none
		if(!info) {
			//Unknown MIME type
			return FBrowser.mime['-default-'];
		} else {
			//Return the info
			return info;
		}
	},
	
	//Debug mode
	dbug: function() {
		FBrowser.index = FBrowser.fakeIndex;
		FBrowser.rebuildFolderTree();
	}
};

//File List
var FList = {
	
	//Create the list
	create: function(path) {
		//Highlight the path in the quick access bar
		var qabar = document.querySelector('div[path="' + path.replace(/\\/g,"\\\\") + '"]>.hbox');
		if(qabar) {
			//Deselect all nodes
			var selected = document.querySelector(".node .hbox.selected");
			if(selected) { selected.className = "hbox"; }
			//Get the node
			qabar.className = "hbox selected";
		}
		
		//Update path
		document.getElementById("pathname").value = path;
		
		//Get the file list
		var flist = document.getElementById("flist");
		//Delete all entries
		flist.innerHTML = "";
		
		//Get the path
		var pathparts = path.split("\\");
		//Get the base index
		var idata = FBrowser.index;
		//Iterate through the path
		for(var i = 0; i < pathparts.length; i++) {
			//Skip blanks
			if(pathparts[i] == "") { continue; }
			//Debug
			console.log("Finding " + pathparts[i]);
			console.log(idata);
			//Pass
			var pass = true;
			//Check if there are children
			if(!idata[pathparts[i]]) {
				//Invalid path
				console.log("Invalid path, folder does not exist");
				//Create error
				var e = document.createElement("div");
				e.className = "ferr";
				e.innerHTML = "The requested folder could not be found";
				flist.appendChild(e);
				return;
			} else {
				//Found the folder
				idata = idata[pathparts[i]];
			}
			//Check for children
			if(!idata['children']) {
				//No children
				console.log("Invalid path, folder has no children");
				//Create error
				var e = document.createElement("div");
				e.className = "ferr";
				e.innerHTML = "This folder is empty";
				flist.appendChild(e);
				return;
			} else {
				//Pass
				idata = idata['children']
				continue;
			}
		}
		//Iterate through the children
		for(var key in idata) {
			//Check if own member
			if(idata.hasOwnProperty(key)) {
				//Get the entry
				var entry = idata[key];
				//Check if folder
				if(entry['mime'] == "directory") {
					//Show
					flist.appendChild(FList.createEntry(
						entry['mime'],
						key,
						entry['date'],
						entry['size'],
						path + key + "\\"
					));
				}
			}
		}
		//Iterate through the children again
		for(var key in idata) {
			//Check if own member
			if(idata.hasOwnProperty(key)) {
				//Get the entry
				var entry = idata[key];
				//Check if folder
				if(entry['mime'] != "directory") {
					//Show
					flist.appendChild(FList.createEntry(
						entry['mime'],
						key,
						entry['date'],
						entry['size'],
						path + key
					));
				}
			}
		}
	},
	
	//Create a list entry
	createEntry: function(mime, name, date, size, path) {
		//Get mime info
		var minfo = FBrowser.getMimeInfo(mime);
		
		//Create the highlight box
		var hbox = document.createElement("div");
		hbox.className = "hbox";
		hbox.onclick = FList.fileClick;
		hbox.ondblclick = FList.fileDClick;
		hbox.oncontextmenu = FList.fileClick;
		
		//Set attributes
		hbox.setAttribute("mime", mime);
		hbox.setAttribute("path", path);
		
		//Create the name box
		var nbox = document.createElement("div");
		nbox.className = "name";
		hbox.appendChild(nbox);
		
		//Create the icon
		var icon = document.createElement("img");
		icon.src = "icon/" + minfo[1] + ".png";
		nbox.appendChild(icon);
		
		//Create the name label
		var nlabel = document.createElement("span");
		nlabel.innerHTML = name;
		nbox.appendChild(nlabel);
		
		//Create the date box
		var datebox = document.createElement("div");
		datebox.className = "date";
		datebox.innerHTML = date;
		hbox.appendChild(datebox);
		
		//Create the type box
		var typebox = document.createElement("div");
		typebox.className = "type";
		typebox.innerHTML = minfo[0];
		hbox.appendChild(typebox);
		
		//Create the size box
		var sizebox = document.createElement("div");
		sizebox.className = "size";
		sizebox.innerHTML = size;
		hbox.appendChild(sizebox);
		
		//Return the box
		return hbox;
	},
	
	//File click
	fileClick: function(e) {
		//Deselect all nodes
		var selected = document.querySelector(".fpanel .hbox.selected");
		if(selected) { selected.className = "hbox"; }
		//Get the node
		var node = e.target;
		while(!node.className.includes("hbox")) {
			node = node.parentNode;
		}
		//Select the node
		node.className = "hbox selected";
	},
	
	//File doubleclick
	fileDClick: function(e) {
		//Get the node
		var node = e.target;
		while(!node.className.includes("hbox")) {
			node = node.parentNode;
		}
		//Check the mime type
		if(node.getAttribute("mime") == "directory") {
			//Navigate to the node
			FList.create(node.getAttribute("path"));
		}
	}
};

//Context Menu Handler
var CMenu = {
	
	//Assign Handlers
	assignHandlers: function() {
		//Assign click handler to page
		document.body.addEventListener("click", CMenu.clickHandler);
		
		//Get the file panel
		var fpanel = document.getElementById("fpanel");
		//Assign handlers
		fpanel.addEventListener("contextmenu", CMenu.contextHandler);
	},
	
	//Click Handler
	clickHandler: function() {
		//Get the context menu
		var cmenu = document.getElementById("contextmenu");
		//Hide the menu
		cmenu.style.display = "none";
	},
	
	//Event Handler
	contextHandler: function(e) {
		//Get the context menu
		var cmenu = document.getElementById("contextmenu");
		//Set the position
		cmenu.style.top = (e.clientY + 1) + "px";
		cmenu.style.left = (e.clientX + 1) + "px";
		//Show the menu
		cmenu.style.display = "block";
		console.log(e);
		//Kill the event
		e.preventDefault();
		console.log("??");
		return false;
	}
};

//Tree Builder
var Tree = {
	
	//Create tree
	build: function(index, parent, path) {
		//Iterate over the keys
		for(var key in index) {
			//Check if actual key
			if(index.hasOwnProperty(key)) {
				//Check the mime
				if(index[key]['mime'] == 'directory') {
					//Create the node
					var node = Tree.createNode(key);
					//Append to the parent
					parent.appendChild(node);
					//Set path
					node.setAttribute("path", path + key + "\\");
					//Check if children
					if(index[key]['children']) {
						//Build the tree
						Tree.build(index[key]['children'], node, path + key + "\\");
					}
				}
			}
		}
	},
	
	//Create a new entry
	createNode: function(name, iconf="folder-horizontal") {
		//Log
		console.log("Creating node \"" + name + "\"");
		
		//Create the node
		var node = document.createElement("div");
		node.className = "node";
		
		//Create the highlight box
		var hbox = document.createElement("div");
		hbox.className = "hbox";
		hbox.onclick = Tree.nodeClick;
		hbox.oncontextmenu = Tree.nodeClick;
		node.appendChild(hbox);
		
		//Create the expand icon
		var expand = document.createElement("img");
		expand.src = "icon/toggle-expand.png"
		expand.onclick = Tree.nodeToggle;
		expand.setAttribute("state",0);
		hbox.appendChild(expand);

		//Create the icon
		var icon = document.createElement("img");
		icon.src = "icon/" + iconf + ".png";
		hbox.appendChild(icon);
		
		//Create the name label
		var nlabel = document.createElement("span");
		nlabel.innerHTML = name;
		hbox.appendChild(nlabel);
		
		//Return the node
		return node;
	},
	
	//Node toggle callback
	nodeToggle: function(e) {
		//Stop event propagation
		e.stopPropagation();
		//Get the node
		var node = e.target.parentNode.parentNode;
		//Check the status
		if(e.target.getAttribute("state") == 0) {
			//Expand
			node.style.maxHeight = "100000px";
			//Set icon
			e.target.src = "icon/toggle.png";
			//Set status
			e.target.setAttribute("state",1);
		} else {
			//Contract
			node.style.maxHeight = "25px";
			//Set icon
			e.target.src = "icon/toggle-expand.png";
			//Set status
			e.target.setAttribute("state",0);
		}
	},
	
	//Node clicked callback
	nodeClick: function(e) {
		//Deselect all nodes
		var selected = document.querySelector(".node .hbox.selected");
		if(selected) { selected.className = "hbox"; }
		//Get the node
		var node = e.target;
		while(!node.className.includes("hbox")) {
			node = node.parentNode;
		}
		//Select the node
		node.className = "hbox selected";
		//Navigate to the node
		FList.create(node.parentElement.getAttribute("path"));
	}
};