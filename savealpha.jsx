  
function  saveAlpha(alphaName){  
var idDplc = charIDToTypeID( "Dplc" );  
    var desc27 = new ActionDescriptor();  
     var idnull = charIDToTypeID( "null" );  
        var ref11 = new ActionReference();  
        var idChnl = charIDToTypeID( "Chnl" );  
        var idfsel = charIDToTypeID( "fsel" );  
        ref11.putProperty( idChnl, idfsel );  
    desc27.putReference( idnull, ref11 );  
    var idNm = charIDToTypeID( "Nm  " );  
    desc27.putString( idNm, alphaName );  
try {  
executeAction( idDplc, desc27, DialogModes.NO );  
}  
catch(e) {}  
}  