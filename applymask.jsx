app.activeDocument.activeLayer = lyr;   
selectRasterLayerContents();
app.activeDocument.activeLayer = grp;
AddMaskToGroup();   


//Selects the contents of the active layer.
function selectRasterLayerContents() {
var id47 = charIDToTypeID( "setd" );
    var desc11 = new ActionDescriptor();
    var id48 = charIDToTypeID( "null" );
        var ref11 = new ActionReference();
        var id49 = charIDToTypeID( "Chnl" );
        var id50 = charIDToTypeID( "fsel" );
        ref11.putProperty( id49, id50 );
    desc11.putReference( id48, ref11 );
    var id51 = charIDToTypeID( "T   " );
        var ref12 = new ActionReference();
        var id52 = charIDToTypeID( "Chnl" );
        var id53 = charIDToTypeID( "Chnl" );
        var id54 = charIDToTypeID( "Trsp" );
        ref12.putEnumerated( id52, id53, id54 );
    desc11.putReference( id51, ref12 );
executeAction( id47, desc11, DialogModes.NO );
}


//adds a mask revealing the selection to the active group
function AddMaskToGroup() {
    var id42 = charIDToTypeID( "Mk  " );
    var desc8 = new ActionDescriptor();
    var id43 = charIDToTypeID( "Nw  " );
    var id44 = charIDToTypeID( "Chnl" );
    desc8.putClass( id43, id44 );
    var id45 = charIDToTypeID( "At  " );
        var ref10 = new ActionReference();
        var id46 = charIDToTypeID( "Chnl" );
        var id47 = charIDToTypeID( "Chnl" );
        var id48 = charIDToTypeID( "Msk " );
        ref10.putEnumerated( id46, id47, id48 );
    desc8.putReference( id45, ref10 );
    var id49 = charIDToTypeID( "Usng" );
    var id50 = charIDToTypeID( "UsrM" );
    var id51 = charIDToTypeID( "RvlS" );
    desc8.putEnumerated( id49, id50, id51 );
executeAction( id42, desc8, DialogModes.NO );
}