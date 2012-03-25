/**
 * @author Troy
 */

// Used as objloader
function Obj(fileName, scene){
    
    // need to parse .obj file
    
    //this.geometry;
    //this.material;
    //this.material
    
    // how the hell do we read files in our directories??
    
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    
    var reader = new FileReader();
    //reader.onload = (function(theFile){
     //   
    //});
    
    //file 
    //reader.readAsText();

}
