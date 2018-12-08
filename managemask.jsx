main()  
  
function main()  
    {  
    try {  
        link_mask(false);  
        select_layer_rgb();   
        var den = app.activeDocument.activeLayer.layerMaskDensity;  
        app.activeDocument.activeLayer.layerMaskDensity = 50;  
        transform();  
        //menu("freeTransform");  
        app.activeDocument.activeLayer.layerMaskDensity = den;  
        link_mask(true);  
        }  
    catch(e) { alert(e);  }  
    }  
  
/////////////////////////////////////////////  
function link_mask(state)  
    {  
    try {  
        var r = new ActionReference();  
        r.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ));  
        var d = new ActionDescriptor();  
        d.putReference( charIDToTypeID( "null" ), r );  
        var d2 = new ActionDescriptor();  
        d2.putBoolean( charIDToTypeID( "Usrs" ), state );  
        d.putObject( charIDToTypeID( "T   " ), charIDToTypeID( "Lyr " ), d2 );  
        executeAction( charIDToTypeID( "setd" ), d, DialogModes.NO );  
        }  
    catch(e) { throw(e); }  
    }  
  
/////////////////////////////////////////////  
function select_layer_rgb()  
    {  
    try {   
        var r = new ActionReference();  
        r.putEnumerated( charIDToTypeID( "Chnl" ), charIDToTypeID( "Chnl" ), charIDToTypeID( "RGB " ) );  
        var d = new ActionDescriptor();  
        d.putReference( charIDToTypeID( "null" ), r );  
        d.putBoolean( charIDToTypeID( "MkVs" ), false );  
        executeAction( charIDToTypeID( "slct" ), d, DialogModes.NO );  
        }  
    catch (e) { throw(e); }   
    }  
  
/////////////////////////////////////////////  
function menu(str)  
    {  
    try {  
        var r = new ActionReference();  
        r.putEnumerated( charIDToTypeID( "Mn  " ), charIDToTypeID( "MnIt" ), stringIDToTypeID(str) );  
        var d  = new ActionDescriptor();  
        d.putReference( charIDToTypeID( "null" ), r );  
        executeAction( charIDToTypeID( "slct" ), d, DialogModes.ALL );  
        }  
    catch (e) { beep() }  
    }  
  
/////////////////////////////////////////////  
function transform(linked)  
    {  
    try {  
        if (linked == undefined) linked = true;  
  
        var r = new ActionReference();  
        var d1  = new ActionDescriptor();  
        var d2  = new ActionDescriptor();  
  
        var ret = true;  
  
        try {  
            r.putEnumerated( charIDToTypeID( "Lyr " ), charIDToTypeID( "Ordn" ), charIDToTypeID( "Trgt" ) );  
  
            d2.putUnitDouble( charIDToTypeID( "Hrzn" ), charIDToTypeID( "#Rlt" ), 0 );  
            d2.putUnitDouble( charIDToTypeID( "Vrtc" ), charIDToTypeID( "#Rlt" ), 0 );  
  
            d1.putReference( charIDToTypeID( "null" ), r );  
            d1.putEnumerated( charIDToTypeID( "FTcs" ), charIDToTypeID( "QCSt" ), charIDToTypeID( "Qcsa" ) );  
  
            d1.putObject( charIDToTypeID( "Ofst" ), charIDToTypeID( "Ofst" ), d2 );  
            d1.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Prc" ), 100 );  
            d1.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Prc" ), 100 );  
            d1.putBoolean( charIDToTypeID( "Lnkd" ), linked );  
  
            d1.putEnumerated( charIDToTypeID( "Intr" ), charIDToTypeID( "Intp" ), charIDToTypeID( "Bcbc" ) );  
            executeAction( charIDToTypeID( "Trnf" ), d1, DialogModes.ALL );   
            }  
        catch(e) { ret = false; }  
  
        return ret;  
        }  
    catch (e) { throw(e); }  
    }  