/**
 * @author Troy
 */

// Used as objloader
function Obj(fileData, scene){
    
    // need to parse .obj file
    
    //this.geometry;
    //this.material;
    //this.material
    
    // how the hell do we read files in our directories??
    var lines = fileData.split("\n");
    var i = 0;
    for(; i < lines.length; i += 1){
        document.write("<br /> Element" + i + " = " + lines[i]);
    }
    
}
