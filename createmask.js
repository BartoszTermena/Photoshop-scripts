makeLayerMask('RvlS');



    function makeLayerMask(maskType) {
    if( maskType == undefined) maskType = 'RvlS' ; //from selection
    //requires a selection 'RvlS'  complete mask 'RvlS' otherThanSelection 'RvlS'
        var desc140 = new ActionDescriptor();
        desc140.putClass( charIDToTypeID('Nw  '), charIDToTypeID('Chnl') );
            var ref51 = new ActionReference();
            ref51.putEnumerated( charIDToTypeID('Chnl'), charIDToTypeID('Chnl'), charIDToTypeID('Msk ') );
        desc140.putReference( charIDToTypeID('At  '), ref51 );
        desc140.putEnumerated( charIDToTypeID('Usng'), charIDToTypeID('UsrM'), charIDToTypeID(maskType) );
        executeAction( charIDToTypeID('Mk  '), desc140, DialogModes.NO );
    }