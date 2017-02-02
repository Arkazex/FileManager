<!DOCTYPE html>
<html>
	<head>
		<!-- Page title -->
		<title>File Manager</title>
		<!-- Include the CSS -->
		<link rel="stylesheet" href="bootstrap.min.css">
		<link rel="stylesheet" href="tree.css">
		<link rel="stylesheet" href="ftable.css">
		<link rel="stylesheet" href="filemanager.css">
		<!-- Script -->
		<script src="fmanage.js"></script>
		<!-- Additional Style -->
		<style>
		.navbar {
			/* Override the bottom padding */
			margin-bottom: 0;
			/* Override the z-index */
			z-index: 1000;
			/* Override the border radius */
			border-radius: 0;
		}
		/* Body Table */
		.bodytable {
			height: calc(100vh - 64px);
			width: 100vw;
		}
		.bodytable td {
			vertical-align: top;
		}
		/* Quick-nav panel */
		.qnav {
			width: 25vw;
			xheight: calc(100vh - 64px);
			xborder-right: 1px solid black;
			box-shadow: 1px 0px 2px rgba(0,0,0,.3);
			xdisplay: inline-block;
			padding: 5px;
		}
		/* Button Margin */
		.btn {
			margin-left: 20px;
		}
		/* Body Table */
		.bodytable td{
			padding: 0;
		}
		.ftable td:first-child {
			color: black;
		}
		.ftable .filename {
			margin-left: 4px;
		}
		/* Selected Row */
		.srow td{
			background-color: #aaaaff;
		}
		/* Scroll Panel */
		.scroll {
			height: calc(100vh - 64px);
			overflow-y: scroll;
		}
		.scroll.tree {
			padding-top: 10px;
			padding-left: 5px;
			padding-right: 5px;
		}
		.scroll>.node {
			margin-left: 0;
		}
		/* Context Menu */
		.cmenu {
			position: fixed;
			width: 150px;
			background-color: white;
			border: 1px solid #bbbbbb;
			top: 150px;
			left: 150px;
			padding: 2px;
			box-shadow: 2px 2px 3px rgba(0,0,0,.3);
		}
		</style>
	</head>
	<body onload="FBrowser.dbug();CMenu.assignHandlers()">
		<!-- Header Bar -->
		<div class="navbar navbar-default">
			<!-- Header -->
			<div class="navbar-header">
				<!-- Brand -->
				<a class="navbar-brand">File Manager</a>
			</div>
			<!-- Input Form -->
			<form class="navbar-form navbar-left">
				<div class="form-group">
					<!-- Current path -->
					<input type="text" id="pathname" class="form-control" value="\">
					<!-- File Upload -->
					<input type="file" id="uploadinput" style="display:none">
					<!-- Buttons -->
					<button type="button" class="btn btn-default" onclick="upload()">Upload</button>
					<button disabled type="button" id="pickbutton" class="btn btn-info" style="display:none" onclick="alert('nee')">Select File</button>
				</div>
			</form>
		</div>
		<!-- Body table -->
		<table class="bodytable">
			<!-- Main row -->
			<tr>
				<!-- Quick Nav Bar -->
				<td rowspan=2 class="qnav tree">
					<!-- Scroll Panel -->
					<div class="scroll" id="qnav">
					</div>
				</td>
				<!-- File Panel -->
				<td class="fpanel" id="fpanel">
					<!-- File Table Header -->
					<div class="header">
						<div class="name">Name</div>
						<div class="date">Date Modified</div>
						<div class="type">Type</div>
						<div class="size">Size</div>
					</div>
					<!-- Scroll Panel -->
					<div class="fscroll" id="flist">
					</div>
				</td>
			</tr>
			<!-- Secondary Row -->
			<tr>
				<!-- File information Panel -->
				<td class="fipanel">
					Hello World
				</td>
			</td>
		</table>
		
		<!-- Context Menu -->
		<div class="cmenu" id="contextmenu" oncontextmenu="return false;">
			<div class="hbox disabled">
				<img src="icon/home.png">Home
			</div>
			<div class="hbox disabled">
				<img src="icon/document-copy.png">Copy
			</div>
			<div class="hbox">
				<img src="icon/cross.png">Delete
			</div>
			<div class="separator"></div>
			<div class="hbox">
				<span class="text">Debug</span>
			</div>
		</div>
		
		<!-- Hidden upload pane -->
		<iframe style="display:none" src="upload2.php" id="upframe"></iframe>
		
		<!-- Debug -->
		<script>
		debug();
		</script>
	</body>
</html>