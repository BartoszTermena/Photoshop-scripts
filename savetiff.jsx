#target photoshop
app.bringToFront();



var cs2 = parseInt(app.version) < 10;

var originalDoc;
try {
	originalDoc = app.activeDocument;
} catch (ignored) {}

var defaultSettings = {	
	writeJson: true,
	imagesDir: "./images/",
	jsonPath: "./",
};
var settings = loadSettings();
showSettingsDialog();

var progress, cancel;
function run () {
	showProgressDialog();

	// Output dirs.
	var jsonFile = new File(jsonPath(settings.jsonPath));
	jsonFile.parent.create();
	var imagesDir = absolutePath(settings.imagesDir);
	var imagesFolder = new Folder(imagesDir);
	imagesFolder.create();
	var relImagesDir = imagesFolder.getRelativeURI(jsonFile.parent);
	relImagesDir = relImagesDir == "." ? "" : (relImagesDir + "/");

	// Get ruler origin.
	var action = new ActionReference();
	action.putEnumerated(cID("Dcmn"), cID("Ordn"), cID("Trgt"));
	var result = executeActionGet(action);
	var xOffSet = result.getInteger(sID("rulerOriginH")) >> 16;
	var yOffSet = result.getInteger(sID("rulerOriginV")) >> 16;

	activeDocument.duplicate();


	
	if (app.activeDocument.mode != DocumentMode.RGB) {
		alert("Please change the image mode to RGB color.");
		return;
	}

	// Output template image.
	

	if (!settings.jsonPath && !settings.imagesDir) {
		activeDocument.close(SaveOptions.DONOTSAVECHANGES);
		return;
	}

	// Rasterize all layers.
	try {
		executeAction(sID("rasterizeAll"), undefined, DialogModes.NO);
	} catch (ignored) {}

	// Add a history item to prevent layer visibility from changing by the active layer being reset to the top.
	activeDocument.artLayers.add();
	
	// Collect and hide layers.
	var layers = [];
	collectLayers(activeDocument, layers);
	var layersCount = layers.length;

	// Add a history item to prevent layer visibility from changing by restoreHistory.
	activeDocument.artLayers.add();

	
	
	var slots = {}, slotsCount = 0;
	var skins = { "default": [] }, skinsCount = 0;
	var totalLayerCount = 0;
	outer:
	for (var i = 0; i < layersCount; i++) {
		var layer = layers[i];

		if (layer.kind != LayerKind.NORMAL && !isGroup(layer)) continue;
		layer.attachmentName = folders(layer, "") + stripTags(layer.name);


		layer.slotName = findTag(layer, "slot", layer.attachmentName);
		if (!slots[layer.slotName]) slotsCount++;
		slots[layer.slotName] = { bone: bone, attachment: layer.wasVisible ? layer.attachmentName : null };

		if (layer.blendMode == BlendMode.LINEARDODGE)
			slots[layer.slotName].blend = "additive";
		else if (layer.blendMode == BlendMode.MULTIPLY)
			slots[layer.slotName].blend = "multiply";
		else if (layer.blendMode == BlendMode.SCREEN)
			slots[layer.slotName].blend = "screen";

		var skinName = findTag(layer, "skin", "default");
		var skinSlots = skins[skinName];
		if (!skinSlots) {
			skins[skinName] = skinSlots = {};
			skinsCount++;
		}

		var skinLayers = skinSlots[layer.slotName];
		if (!skinLayers) skinSlots[layer.slotName] = skinLayers = [];
		for (var ii = 0, nn = skinLayers.length; ii < nn; ii++) {
			if (skinLayers[ii].attachmentName == layer.attachmentName) {
				alert("Multiple layers for the \"" + skinName + "\" skin have the same name:\n\n"
					+ layer.attachmentName
					+ "\n\nRename or use the [ignore] tag for the other layers.");
				return;
			}
		}
		skinLayers[skinLayers.length] = layer;
		totalLayerCount++;
		}

	// Output skeleton.
	var json = '{\n "layers": [\n';


	// Output slots.
	var slotIndex = 0;
	for (var slotName in slots) {

		if (!slots.hasOwnProperty(slotName)) continue;
		var slot = slots[slotName];
		json += '\t {\n';
		json += '\t "id": ' + slotIndex + ',\n';
		json += '\t "name": ' + quote(slotName) + ',\n';
		json += '\t "shapes": ' + '[\n' + '\t "children": [], \n' + '\t "id": ' + slotIndex + ', \n' + '\t "name": ' + quote(slotName) + ', \n' + 
		'\t "variants": [\n' + '\t {\n' + '\t "id": ' + slotIndex + ', \n' + '\t "name": ' + quote(slotName) + '\t\n' + '\t }\n';
		json += '\t }';
		slotIndex++;
		json += slotIndex < slotsCount ? ",\n" : "\n";
	}
	json += ']';

	// Output skins.
	var skinIndex = 0, layerCount = 0;
	for (var skinName in skins) {
		if (!skins.hasOwnProperty(skinName)) continue;
		

		var skinSlots = skins[skinName];
		var skinSlotIndex = 0, skinSlotsCount = countAssocArray(skinSlots);
		for (var slotName in skinSlots) {
			if (!skinSlots.hasOwnProperty(slotName)) continue;
			var bone = slots[slotName].bone;

			

			var skinLayers = skinSlots[slotName];
			var skinLayerIndex = 0, skinLayersCount = skinLayers.length;
			for (var i = skinLayersCount - 1; i >= 0; i--) {
				var layer = skinLayers[i];
				layer.visible = true;
				if (cancel) {
					activeDocument.close(SaveOptions.DONOTSAVECHANGES);
					return;
				}
				setProgress(++layerCount / totalLayerCount, trim(layer.name));

				var placeholderName = layer.attachmentName;
				var attachmentName = (skinName == "default" ? "" : skinName + "/") + placeholderName;

				if (isGroup(layer)) {
					activeDocument.activeLayer = layer;
					layer = layer.merge();
				}

				storeHistory();

				
				var width = activeDocument.width.as("px") * 2;
				var height = activeDocument.height.as("px") * 2;
	
				// Save image.
				if (settings.imagesDir) {

					var file = new File(imagesDir + attachmentName);
					file.parent.create();
					SaveTIFF(file);
	
				}

				restoreHistory();
				if (layerCount < totalLayerCount) deleteLayer(layer);

				x += Math.round(width) / 2 ;
				y += Math.round(height) / 2 ;

				// Make relative to the Photoshop document ruler origin.
				x -= xOffSet ;
				y -= (activeDocument.height.as("px") - yOffSet) ;

				if (bone) { // Make relative to parent bone.
					x -= bone.x;
					y -= bone.y;
				}

				
				if (attachmentName != placeholderName);
			}	
		}
	}
	
	activeDocument.close(SaveOptions.DONOTSAVECHANGES);

	// Output JSON file.
	if (settings.writeJson && settings.jsonPath) {
		jsonFile.encoding = "UTF-8";
		jsonFile.remove();
		jsonFile.open("w", "TEXT");
		jsonFile.lineFeed = "\n";
		jsonFile.write(json);
		jsonFile.close();
	}
}

// Settings dialog:

function showSettingsDialog () {
	if (parseInt(app.version) < 9) {
		alert("Photoshop CS2 or later is required.");
		return;
	}
	if (!originalDoc) {
		alert("Please open a document before running the PhotoshopToSpine script.");
		return;
	}
	if (!hasFilePath()) {
		alert("Please save the document before running the PhotoshopToSpine script.");
		return;
	}

	// Layout.
	var dialog = new Window("dialog", "asd"), group;
	dialog.alignChildren = "fill";

	try {
		dialog.add("image", undefined, new File(scriptDir() + "logo.png"));
	} catch (ignored) {}

	var settingsGroup = dialog.add("panel", undefined, "Settings");
		settingsGroup.margins = [10,15,10,10];
		settingsGroup.alignChildren = "fill";
		var checkboxGroup = settingsGroup.add("group");
			checkboxGroup.alignChildren = ["left", ""];
			checkboxGroup.orientation = "row";
			group = checkboxGroup.add("group");
				group.orientation = "column";
				group.alignChildren = ["left", ""];
			group = checkboxGroup.add("group");
				group.orientation = "column";
				group.alignChildren = ["left", ""];
				group.alignment = ["", "top"];
				var writeJsonCheckbox = group.add("checkbox", undefined, " Write JSON");
				writeJsonCheckbox.value = settings.writeJson;
		
		if (!cs2) {
			var slidersGroup = settingsGroup.add("group");
				group = slidersGroup.add("group");
					group.orientation = "column";
					group.alignChildren = ["right", ""];
				group = slidersGroup.add("group");
					group.orientation = "column";
				group = slidersGroup.add("group");
					group.orientation = "column";
				group = slidersGroup.add("group");
					group.orientation = "column";
					group.alignChildren = ["fill", ""];
					group.alignment = ["fill", ""];
		} else {
			group = settingsGroup.add("group");
			group = settingsGroup.add("group");
		}

	var outputPathGroup = dialog.add("panel", undefined, "Output Paths");
		outputPathGroup.alignChildren = ["fill", ""];
		outputPathGroup.margins = [10,15,10,10];
		var imagesDirText, imagesDirPreview, jsonPathText, jsonPathPreview;
		if (!cs2) {
			var textGroup = outputPathGroup.add("group");
			textGroup.orientation = "column";
			textGroup.alignChildren = ["fill", ""];
			group = textGroup.add("group");
				group.add("statictext", undefined, "Images:");
				imagesDirText = group.add("edittext", undefined, settings.imagesDir);
				imagesDirText.alignment = ["fill", ""];
			imagesDirPreview = textGroup.add("statictext", undefined, "");
			imagesDirPreview.maximumSize.width = 260;
			group = textGroup.add("group");
				var jsonLabel = group.add("statictext", undefined, "JSON:");
				jsonLabel.justify = "right";
				jsonLabel.minimumSize.width = 41;
				jsonPathText = group.add("edittext", undefined, settings.jsonPath);
				jsonPathText.alignment = ["fill", ""];
			jsonPathPreview = textGroup.add("statictext", undefined, "");
			jsonPathPreview.maximumSize.width = 260;
		} else {
			outputPathGroup.add("statictext", undefined, "Images:");
			imagesDirText = outputPathGroup.add("edittext", undefined, settings.imagesDir);
			imagesDirText.alignment = "fill";
			outputPathGroup.add("statictext", undefined, "JSON:");
			jsonPathText = outputPathGroup.add("edittext", undefined, settings.jsonPath);
			jsonPathText.alignment = "fill";
		}
	var buttonGroup = dialog.add("group");
		var helpButton;
		if (!cs2) helpButton = buttonGroup.add("button", undefined, "Help");
		group = buttonGroup.add("group");
			group.alignment = ["fill", ""];
			group.alignChildren = ["right", ""];
			var runButton = group.add("button", undefined, "OK");
			var cancelButton = group.add("button", undefined, "Cancel");

	// Tooltips.
	
	// Events.
	cancelButton.onClick = function () {
		cancel = true;
		dialog.close();
		return;
	};
	if (!cs2) helpButton.onClick = showHelpDialog;
	jsonPathText.onChanging = function () {
		var text = jsonPathText.text ? jsonPath(jsonPathText.text) : "<no JSON output>";
		if (!cs2) {
			jsonPathPreview.text = text;
			jsonPathPreview.helpTip = text;
		} else
			jsonPathText.helpTip = text;
	};
	imagesDirText.onChanging = function () {
		var text = imagesDirText.text ? absolutePath(imagesDirText.text) : "<no image output>";
		if (!cs2) {
			imagesDirPreview.text = text;
			imagesDirPreview.helpTip = text;
		} else
			imagesDirText.helpTip = text;
	};

	// Run now.
	jsonPathText.onChanging();
	imagesDirText.onChanging();

	function updateSettings () {
		settings.writeJson = writeJsonCheckbox.value;
		settings.imagesDir = imagesDirText.text;
		settings.jsonPath = jsonPathText.text;

	}

	runButton.onClick = function () {
		

		updateSettings();
		saveSettings();
		writeJsonCheckbox.enabled = false;
		imagesDirText.enabled = false;
		jsonPathText.enabled = false;
		if (!cs2) helpButton.enabled = false;
		runButton.enabled = false;
		cancelButton.enabled = false;

		var rulerUnits = app.preferences.rulerUnits;
		app.preferences.rulerUnits = Units.PIXELS;
		try {
			// var start = new Date().getTime();
			run();
			// alert(new Date().getTime() - start);
		
		} finally {
			if (activeDocument != originalDoc) activeDocument.close(SaveOptions.DONOTSAVECHANGES);
			app.preferences.rulerUnits = rulerUnits;
			dialog.close();
		}
	};

	dialog.center();
	dialog.show();
}

function loadSettings () {
	var options = null;
	try {
		options = app.getCustomOptions(sID("settings"));
	} catch (e) {
	}

	var settings = {};
	for (var key in defaultSettings) {
		if (!defaultSettings.hasOwnProperty(key)) continue;
		var typeID = sID(key);
		if (options && options.hasKey(typeID))
			settings[key] = options["get" + getOptionType(defaultSettings[key])](typeID);
		else
			settings[key] = defaultSettings[key];
	}
	return settings;
}

function saveSettings () {
	if (cs2) return; // No putCustomOptions.
	var action = new ActionDescriptor();
	for (var key in defaultSettings) {
		if (!defaultSettings.hasOwnProperty(key)) continue;
		action["put" + getOptionType(defaultSettings[key])](sID(key), settings[key]);
	}
	app.putCustomOptions(sID("settings"), action, true);
}

function getOptionType (value) {
	switch (typeof(value)) {
	case "boolean": return "Boolean";
	case "string": return "String";
	case "number": return "Double";
	};
	throw new Error("Invalid default setting: " + value);
}

// Help dialog.

function showHelpDialog () {
	var dialog = new Window("dialog", "Help");
	dialog.alignChildren = ["fill", ""];
	dialog.orientation = "column";
	dialog.alignment = ["", "top"];

	var helpText = dialog.add("statictext", undefined, ""
		+ "helphelphelp.\n"
		+ "\n"
		+ "asdasdasd"
	, {multiline: true});
	helpText.preferredSize.width = 325;

	var closeButton = dialog.add("button", undefined, "Close");
	closeButton.alignment = ["center", ""];

	closeButton.onClick = function () {
		dialog.close();
	};

	dialog.center();
	dialog.show();
}

// Progress dialog:

function showProgressDialog () {
	var dialog = new Window("palette", "PhotoshopToSpine - Processing...");
	dialog.alignChildren = "fill";
	dialog.orientation = "column";

	var message = dialog.add("statictext", undefined, "Initializing...");

	var group = dialog.add("group");
		var bar = group.add("progressbar");
		bar.preferredSize = [300, 16];
		bar.maxvalue = 10000;
		var cancelButton = group.add("button", undefined, "Cancel");

	cancelButton.onClick = function () {
		cancel = true;
		cancelButton.enabled = false;
		return;
	};

	dialog.center();
	dialog.show();
	dialog.active = true;

	progress = {
		dialog: dialog,
		bar: bar,
		message: message
	};
}

function setProgress (percent, layerName) {
	progress.bar.value = 10000 * percent;
	progress.message.text = "Layer: " + layerName;
	if (!progress.dialog.active) progress.dialog.active = true;
}

// PhotoshopToSpine utility:

function unlock (layer) {
	if (layer.allLocked) layer.allLocked = false;
	if (!layer.layers) return;
	for (var i = layer.layers.length - 1; i >= 0; i--)
		unlock(layer.layers[i]);
}

function deleteLayer (layer) {
	unlock(layer);
	activeDocument.activeLayer = activeDocument.artLayers[0];
	layer.remove();
}

function collectLayers (parent, collect) {
	for (var i = parent.layers.length - 1; i >= 0; i--) {
		if (cancel) return;
		var layer = parent.layers[i];
		
		if (findTag(layer, "ignore")) {
			deleteLayer(layer);
			continue;
		}
		var group = isGroup(layer);
		if (!group && layer.bounds[2] == 0 && layer.bounds[3] == 0) {
			deleteLayer(layer);
			continue;
		}

		// Ensure tags are valid.
		var re = /\[([^\]]+)\]/g;
		while (true) {
			var matches = re.exec(layer.name);
			if (!matches) break;
			var tag = matches[1].toLowerCase();
			if (group) {
				if (!isValidGroupTag(tag)) {
					var message = "Invalid group name:\n\n" + layer.name;
					if (isValidLayerTag(tag))
						message += "\n\nThe [" + tag + "] tag is only valid for layers, not for groups.";
					else
						message += "\n\nThe [" + tag + "] tag is not a valid tag.";
					alert(message);
					cancel = true;
					return;
				}
			} else if (!isValidLayerTag(tag)) {
				var message = "Invalid layer name:\n\n" + layer.name;
				if (isValidGroupTag(tag))
					message += "\n\nThe [" + tag + "] tag is only valid for groups, not for layers.";
				else
					message += "\n\nThe [" + tag + "] tag is not a valid tag.";
				alert(message);
				cancel = true;
				return;
			}
		}

		// Ensure only one tag.
		if (layer.name.replace(/\[[^\]]+\]/, "").search(/\[[^\]]+\]/) != -1) {
			alert("A " + (group ? "group" : "layer") + " name must not have more than one tag:\n" + layer.name);
			cancel = true;
			return;
		}

		var changeVisibility = layer.kind == LayerKind.NORMAL || group;
		if (changeVisibility) {
			layer.wasVisible = layer.visible;
			layer.visible = true;
			if (layer.allLocked) layer.allLocked = false;
		}

		if (group && findTag(layer, "merge")) {
			collectGroupMerge(layer);
			if (!layer.layers || layer.layers.length == 0) continue;
		} else if (layer.layers && layer.layers.length > 0) {
			collectLayers(layer, collect);
			continue;
		}

		if (changeVisibility) layer.visible = false;
		collect.push(layer);
	}
}

function collectGroupMerge (parent) {
	if (!parent.layers) return;
	for (var i = parent.layers.length - 1; i >= 0; i--) {
		var layer = parent.layers[i];
		
		if (findTag(layer, "ignore")) {
			deleteLayer(layer);
			continue;
		}

		collectGroupMerge(layer);
	}
}

function isValidGroupTag (tag) {
	switch (tag) {
	case "bone":
	case "slot":
	case "skin":
	case "merge":
	case "folder":
	case "ignore":
		return true;
	}
	return false;
}

function isValidLayerTag (tag) {
	switch (tag) {
	case "ignore":
		return true;
	}
	return false;
}

function isGroup (layer) {
	return layer.typename == "LayerSet";
}

function stripTags (name) {
	return trim(name.replace(/\[[^\]]+\]/g, ""));
}

function findTagLayer (layer, tag) {
	while (layer) {
		if (tag == "ignore" || isGroup(layer)) { // Non-group layers can only have ignore tag.
			if (layer.name.toLowerCase().indexOf("[" + tag + "]") != -1) return layer;
		}
		layer = layer.parent;
	}
	return null;
}

function findTag (layer, tag, otherwise) {
	var found = findTagLayer(layer, tag);
	return found ? stripTags(found.name) : otherwise;
}

function jsonPath (jsonPath) {
	if (endsWith(jsonPath, ".json")) {
		var index = jsonPath.replace("\\", "/").lastIndexOf("/");
		if (index != -1) return absolutePath(jsonPath.slice(0, index + 1)) + jsonPath.slice(index + 1);
		return absolutePath("./") + jsonPath;
	} 
	var name = decodeURI(originalDoc.name);
	return absolutePath(jsonPath) + name.substring(0, name.indexOf(".")) + ".json";
}

function folders (layer, path) {
	var folderLayer = findTagLayer(layer, "folder");
	return folderLayer ? folders(folderLayer.parent, stripTags(folderLayer.name) + "/" + path) : path;
}

// Photoshop utility:


var history;
function storeHistory () {
	history = activeDocument.activeHistoryState;
}
function restoreHistory () {
	activeDocument.activeHistoryState = history;
}

function scriptDir () {
	var file;
	if (!cs2)
		file = $.fileName;
	else {
		try {
			var error = THROW_ERROR; // Force error which provides the script file name.
		} catch (ex) {
			file = ex.fileName;
		}
	}
	return new File(file).parent + "/";
}

function hasFilePath () {
	var action = new ActionReference();
	action.putEnumerated(cID("Dcmn"), cID("Ordn"), cID("Trgt"));
	return executeActionGet(action).hasKey(sID("fileReference"));
}

function absolutePath (path) {
	path = trim(path);
	if (!startsWith(path, "./")) {
		var absolute = decodeURI(new File(path).absoluteURI);
		if (!startsWith(absolute, decodeURI(new File("child").parent.absoluteURI))) return absolute + "/";
		path = "./" + path;
	}
	if (path.length == 0)
		path = decodeURI(activeDocument.path);
	else if (startsWith(settings.imagesDir, "./"))
		path = decodeURI(activeDocument.path) + path.substring(1);
	path = path.replace(/\\/g, "/");
	if (path.substring(path.length - 1) != "/") path += "/";
	return path;
}

function cID (id) {
	return charIDToTypeID(id);
}

function sID (id) {
	return stringIDToTypeID(id);
}



function savePNG (file) {
	var options = new PNGSaveOptions();
	options.compression = 9;
	activeDocument.saveAs(file, options, true, Extension.LOWERCASE);
}



function main(file){
alert(file);
var Path = Folder("/C/scripts");

if(!Path.exists){

    alert(Path + " does not exist!");

    return;

    }

var fileName = 'asd';

if(fileName == '') {

    alert("There is no title in this document");

    return;

    }

var saveFile = File(Path + "/" + fileName + ".tif");

if(saveFile.exists) saveFile = File(Path + "/" + fileName +"-" + time() + ".tif");

SaveTIFF(saveFile);

app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);

};


function savePNG (file) {
	var options = new PNGSaveOptions();
	options.compression = 9;
	activeDocument.saveAs(file, options, true, Extension.LOWERCASE);
}

function SaveTIFF(saveFile){

tiffSaveOptions = new TiffSaveOptions();

tiffSaveOptions.embedColorProfile = true;

tiffSaveOptions.alphaChannels = true;

tiffSaveOptions.layers = true;

tiffSaveOptions.imageCompression = TIFFEncoding.TIFFZIP;

activeDocument.saveAs(saveFile, tiffSaveOptions, true, Extension.LOWERCASE);

};

function time(){

var date = new Date();

    var d  = date.getDate();

    var day = (d < 10) ? '0' + d : d;

    var m = date.getMonth() + 1;

    var month = (m < 10) ? '0' + m : m;

    var yy = date.getYear();

    var year = (yy < 1000) ? yy + 1900 : yy;

    var digital = new Date();

    var hours = digital.getHours();

    var minutes = digital.getMinutes();

    var seconds = digital.getSeconds();

    var amOrPm = "AM";

    if (hours > 11) amOrPm = "PM";

    if (hours > 12) hours = hours - 12;

    if (hours == 0) hours = 12;

    if (minutes <= 9) minutes = "0" + minutes;

    if (seconds <= 9) seconds = "0" + seconds;

    todaysDate =  hours + "-" + minutes + "-" + seconds + amOrPm;

    return todaysDate.toString();

};

// JavaScript utility:

function countAssocArray (obj) {
	var count = 0;
	for (var key in obj)
		if (obj.hasOwnProperty(key)) count++;
	return count;
}

function trim (value) {
	return value.replace(/^\s+|\s+$/g, "");
}

function startsWith (str, prefix) {
	return str.indexOf(prefix) === 0;
}

function endsWith (str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function quote (value) {
	return '"' + value.replace('"', '\\"') + '"';
}
function makeLayerMask(maskType) {

    var desc140 = new ActionDescriptor();
    desc140.putClass( charIDToTypeID('Nw  '), charIDToTypeID('Chnl') );
        var ref51 = new ActionReference();
        ref51.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk ') );
    desc140.putReference( charIDToTypeID('At  '), ref51 );
    desc140.putEnumerated( charIDToTypeID('Usng'), charIDToTypeID('UsrM'), charIDToTypeID(maskType) );
    executeAction( charIDToTypeID('Mk  '), desc140, DialogModes.NO );
}