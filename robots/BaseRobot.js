import { LDrawLoader } from '../gfx/LDrawLoader.js'; // use fixed - 

export class BaseRobot {
    constructor() {
        this.description = "Abstract Robot";
        this.joints = [];
        this.jointAxis = [];
        this.axisLimits = [];
        this.jointLimits = [];
        this.axisVel = [];
        this.jointVel = [];
        this.axisAcc = [];
        this.jointAcc = [];
    }    

    get numJoints() {
        return this.joints.length;
    }

    updateJoints() { }

    load( modelFilename, onLoad, onProgress, onError ) {
        this.filename = modelFilename;      
        var loader = new LDrawLoader();
        loader.smoothNormals = true; 
        loader.separateObjects = true;
        loader
            .setPath( "ldraw/" )        
            .load( "models/" + modelFilename, function ( model ) {

                //console.log(model);

                // Convert from LDraw coordinates: rotate -90 degrees around X
                model.rotateX(-Math.PI/2);

                // Adjust materials
                model.traverse( c => { 
                    c.visible = !c.isLineSegments;                 

                    if (c.isMesh)
                    {
                        c.castShadow = true; 
                        c.receiveShadow = true; 
                    }
                }, onProgress, onError);

                self.model = model;

                if (onLoad) onLoad(model);
            });            
    }
}
