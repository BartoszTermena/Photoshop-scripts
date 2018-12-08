#target photoshop

if (app.documents.length > 0) {

app.activeDocument.suspendHistory("add clipping masked layers", "theDialog ()");

};

function theDialog () {

//////////////////////////////////////////

var theLayers = theLayerNames ();

//////////////////////////////

for (var m = 0; m < theLayers.length; m++) {

newLayer (theLayers[m][1], theLayers[m][0]+"_add")

};

//////////////////////////////

$.gc();

};

////////////////////////////////////

function theLayerNames () {

// the file;

var myDocument = app.activeDocument;

// get number of layers;

var ref = new ActionReference();

ref.putEnumerated( charIDToTypeID("Dcmn"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );

var applicationDesc = executeActionGet(ref);

var theNumber = applicationDesc.getInteger(stringIDToTypeID("numberOfLayers"));

// process the layers;

var theLayers = new Array;

for (var m = 0; m <= theNumber; m++) {

try {

var ref = new ActionReference();

ref.putIndex( charIDToTypeID( "Lyr " ), m);

var layerDesc = executeActionGet(ref);

var layerSet = typeIDToStringID(layerDesc.getEnumerationValue(stringIDToTypeID("layerSection")));

var isBackground = layerDesc.getBoolean(stringIDToTypeID("background"));

// if not layer group collect values;

if (layerSet != "layerSectionEnd" && layerSet != "layerSectionStart" && isBackground != true) {

var theName = layerDesc.getString(stringIDToTypeID('name'));

var theID = layerDesc.getInteger(stringIDToTypeID('layerID'));

var theOpacity = layerDesc.getInteger(stringIDToTypeID('opacity'));

theLayers.push([theName, theID, theOpacity])

};

}

catch (e) {};

};

return theLayers

};

////// create new layer //////

function newLayer (theID, theName) {

var idMk = charIDToTypeID( "Mk  " );

    var desc5 = new ActionDescriptor();

    var idnull = charIDToTypeID( "null" );

        var ref2 = new ActionReference();

        var idLyr = charIDToTypeID( "Lyr " );

        ref2.putClass( idLyr );

    desc5.putReference( idnull, ref2 );

    var idUsng = charIDToTypeID( "Usng" );

        var desc6 = new ActionDescriptor();

        var idNm = charIDToTypeID( "Nm  " );

        desc6.putString( idNm, theName );

        var idGrup = charIDToTypeID( "Grup" );

        desc6.putBoolean( idGrup, true );

    desc5.putObject( idUsng, idLyr, desc6 );

executeAction( idMk, desc5, DialogModes.NO );

};