#target photoshop  
var doc = activeDocument;  
app.preferences.rulerUnits = Units.PIXELS;  
  
dlg = new Window('dialog','Final Width Size');  
dlg.gp = dlg.add('group');  
dlg.gp.stxt = dlg.gp.add('statictext',undefined,'Width Size');  
dlg.gp.stxt = dlg.gp.add('statictext',undefined,'Height Size'); 
dlg.gp.stxt = dlg.gp.add('statictext',undefined,'Resolution Size');   
dlg.gp.etxt = dlg.gp.add('edittext',undefined,parseFloat (doc.width));  
dlg.gp.etxt = dlg.gp.add('edittext',undefined,parseFloat (doc.height));  
dlg.gp.etxt = dlg.gp.add('edittext',undefined,parseFloat (doc.resolution)); 
dlg.gp.meas = dlg.gp.add('statictext',undefined,'cm');  
dlg.btn = dlg.add('button',undefined,'Close');  
  
dlg.btn.onClick = function (){  
    dlg.close();  
    }  
  
dlg.show();  