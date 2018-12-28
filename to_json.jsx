var originalDoc = app.activeDocument;

var allLayers = new Array;
var slots = {}, slotsCount = 0;
	var totalLayerCount = 0;
var allLayers = collectAllLayers(originalDoc, allLayers);
var slots = toObject(allLayers, slots);
var settings = {ignoreHiddenLayers: false,
	ignoreBackground: true,
	writeTemplate: false,
	writeJson: true,
	trimWhitespace: true,
	scale: 1,
	padding: 1,
	imagesDir: "./images/",
	jsonPath: "./",};
// Output dirs.
	var jsonFile = new File(jsonPath(settings.jsonPath));
	jsonFile.parent.create();
	var imagesDir = absolutePath(settings.imagesDir);
	var imagesFolder = new Folder(imagesDir);
	imagesFolder.create();
	var relImagesDir = imagesFolder.getRelativeURI(jsonFile.parent);
	relImagesDir = relImagesDir == "." ? "" : (relImagesDir + "/");
	

	

	
function collectAllLayers (originalDoc, allLayers){
    for (var m = 0; m < originalDoc.layers.length; m++){
        var theLayer = originalDoc.layers[m];
		
		
		
        if (theLayer.typename === "ArtLayer"){
            allLayers.push(theLayer.name);
        }
		else{
            collectAllLayers(theLayer, allLayers);
        }
    }
    return allLayers;
}
function toObject(allLayers, slots) {
  for (var i = 0; i < allLayers.length; ++i)
    if (allLayers[i] !== undefined) slots[i] = allLayers[i];
  return slots;
}

	
	json = '"Layers": [\n';

	// Output slots.
	var slotIndex = 0;
	for (var slotName in slots) {
		if (!slots.hasOwnProperty(slotName)) continue;
		var slot = slots[slotName];
		json += '\t{ "name": ' + quote(slot);
	
		json += ' }';
		slotIndex++;
		json += slotIndex < slotsCount ? ",\n" : "\n";
	}
	json += ']';
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
	
function jsonPath (jsonPath) {
	if (endsWith(jsonPath, ".json")) {
		var index = jsonPath.replace("\\", "/").lastIndexOf("/");
		if (index != -1) return absolutePath(jsonPath.slice(0, index + 1)) + jsonPath.slice(index + 1);
		return absolutePath("./") + jsonPath;
	} 
	var name = decodeURI(originalDoc.name);
	return absolutePath(jsonPath) + name.substring(0, name.indexOf(".")) + ".json";
}

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
		if (settings.ignoreHiddenLayers && !layer.visible) {
			deleteLayer(layer);
			continue;
		}
		if (settings.ignoreBackground && layer.isBackgroundLayer) {
			deleteLayer(layer);
			continue;
		}
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
		if (settings.ignoreHiddenLayers && !layer.visible) {
			deleteLayer(layer);
			continue;
		}
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

function scaleImage () {
	var imageSize = activeDocument.width.as("px") * settings.scale;
	activeDocument.resizeImage(UnitValue(imageSize, "px"), null, null, ResampleMethod.BICUBICSHARPER);
}

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

function bgColor (control, r, g, b) {
	control.graphics.backgroundColor = control.graphics.newBrush(control.graphics.BrushType.SOLID_COLOR, [r, g, b]);
}

function deselectLayers () {
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putEnumerated(cID("Lyr "), cID("Ordn"), cID("Trgt"));
	desc.putReference(cID("null"), ref);
	executeAction(sID("selectNoLayers"), desc, DialogModes.NO);
}

function convertToRGB () {
	var desc = new ActionDescriptor();
	desc.putClass(cID("T   "), cID("RGBM"));
	desc.putBoolean(cID("Mrge"), false);
	desc.putBoolean(cID("Rstr"), true);
	executeAction(cID("CnvM"), desc, DialogModes.NO);
}

function savePNG (file) {
	var options = new PNGSaveOptions();
	options.compression = 9;
	activeDocument.saveAs(file, options, true, Extension.LOWERCASE);
}


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