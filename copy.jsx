// LayerPaste2anotherDoc.jsx  
// https://forums.adobe.com/thread/1496531  
  
// regards pixxxelschubser  
  
var aDoc = app.activeDocument;  
var AllDocs = app.documents;  
var actLay = aDoc.activeLayer;  
  
if (AllDocs.length > 1) {  
var itemDoc = null;  
actLay.copy ();  
  
var win = new Window("dialog","Copy the active layer");  
this.windowRef = win;  
win.Txt1 = win.add ("statictext", undefined, "Paste in which open document?");  
win.NewList=win.add ("dropdownlist", undefined, AllDocs);  
  
win.NewList.selection = 0;  
itemDoc = win.NewList.selection.index;  
  
win.cancelBtn = win.add("button", undefined, "Abbruch");  
win.quitBtn = win.add("button", undefined, "Ok");  
win.defaultElement = win.quitBtn;  
win.cancelElement = win.cancelBtn;  
win.quitBtn.onClick = function() {  
win.close();  
}  
  
win.NewList.onChange= function () {  
    itemDoc = win.NewList.selection.index;  
    return itemDoc;  
    }  
  
win.show();  
  
app.activeDocument = app.documents[itemDoc];  
app.activeDocument.paste();  
app.refresh();  
} else {  
    alert ("No other documents open")  
    }  