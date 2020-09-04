import { BaseRobot } from './BaseRobot.js';

const RobotParts = { 
    Base:   0, 
    Joint1: 1,
    Link1:  2,
    Joint2: 3,
    Link2:  4,
    Joint3: 5,
    Link3:  6,
    Joint4: 7,
    Link4:  8,
    Joint5: 9,
    Link5:  10,
    Joint6: 11,
    Flange: 12,
    Tool:   13
}

export class Robot6Axis extends BaseRobot {

    constructor() {
        super();
        for (let idx = 0; idx < 6; idx++) {
            this.joints.push(new THREE.Group());
            this.axisLimits.push({min:-180, max:180}); // limits in °
            this.jointLimits.push({min:-Math.PI, max:Math.PI}); // limits in rad
            this.axisVel.push(160); // default velocity in °/s, override by settings later
            this.jointVel.push(160 / 180 * Math.PI); // default velocity in rad/s, override by settings later
            this.axisAcc.push(600); // default acceleration in °/s², override by settings later
            this.jointAcc.push(600 / 180 * Math.PI); // default acceleration in °/s², override by settings later
        }
        this.jointAxis = ['z', 'x', 'x', 'y', 'x', 'y'];
        
    }

    get joint1() {
        return this.joints[0].rotation.z;
    }

    /**
     * @param {number} value
     */
    set joint1(value) {
        this.joints[0].rotation.z = value;
    }

    get joint2() {
        return this.joints[1].rotation.x;
    }

    /**
     * @param {number} value
     */
    set joint2(value) {
        this.joints[1].rotation.x = value;
    }

    get joint3() {
        return this.joints[2].rotation.x;
    }

    /**
     * @param {number} value
     */
    set joint3(value) {
        this.joints[2].rotation.x = value;
    }

    get joint4() {
        return this.joints[3].rotation.y;
    }

    /**
     * @param {number} value
     */
    set joint4(value) {
        this.joints[3].rotation.y = value;
    }

    get joint5() {
        return this.joints[4].rotation.x;
    }

    /**
     * @param {number} value
     */
    set joint5(value) {
        this.joints[4].rotation.x = value;
    }

    get joint6() {
        return this.joints[5].rotation.y;
    }
    /**
     * @param {number} value
     */
    set joint6(value) {
        this.joints[5].rotation.y = value;
    }

    load(modelFilename, onLoad, onProgress, onError) {

        var self = this;

        super.load(modelFilename, function (model) {

            // rebuild geometry
            var robot = new THREE.Group();
            var groups = [];

            model.traverse( c => {
                if (c.isMesh) {
                    var step = c.parent.userData.constructionStep;
                    if (!groups[step]) {
                        groups[step] = [];
                    }
                    groups[step].push(c);
                }
            });

            // check all parts are available
            for (let part in RobotParts) {
                if (!groups[RobotParts[part]]) {
                    console.warn("Missing robot part " + part + " in " + modelFilename);
                }                
            }
            
            let parts = [];
            // regroup meshes
            for (let group of groups) {
                let newGroup = new THREE.Group();                
                for (let mesh of group) {
                    newGroup.attach(mesh);
                }
                parts.push(newGroup);
                robot.attach(newGroup);
            }

            // build graph
            parts[RobotParts.Base].attach(parts[RobotParts.Joint1]);
            parts[RobotParts.Link1].attach(parts[RobotParts.Joint2]);
            parts[RobotParts.Link2].attach(parts[RobotParts.Joint3]);
            parts[RobotParts.Link3].attach(parts[RobotParts.Joint4]);
            parts[RobotParts.Link4].attach(parts[RobotParts.Joint5]);
            parts[RobotParts.Link5].attach(parts[RobotParts.Joint6]);
            parts[RobotParts.Flange].attach(parts[RobotParts.Tool]);

            let tempGroup = self.joints[0];
            tempGroup.name = "Joint1";
            tempGroup.position.copy(parts[RobotParts.Joint1].children[0].position);
            parts[RobotParts.Joint1].attach(tempGroup);
            tempGroup.attach(parts[RobotParts.Link1]);
            
            tempGroup = self.joints[1];
            tempGroup.name = "Joint2";
            tempGroup.position.copy(parts[RobotParts.Joint2].children[0].position);
            parts[RobotParts.Joint2].attach(tempGroup);
            tempGroup.attach(parts[RobotParts.Link2]);

            tempGroup = self.joints[2];
            tempGroup.name = "Joint3";
            tempGroup.position.copy(parts[RobotParts.Joint3].children[0].position);
            parts[RobotParts.Joint3].add(tempGroup);
            tempGroup.attach(parts[RobotParts.Link3]);

            tempGroup = self.joints[3];
            tempGroup.name = "Joint4";
            tempGroup.position.copy(parts[RobotParts.Joint4].children[0].position);
            parts[RobotParts.Joint4].add(tempGroup);
            tempGroup.attach(parts[RobotParts.Link4]);
            
            tempGroup = self.joints[4];
            tempGroup.name = "Joint5";
            tempGroup.position.copy(parts[RobotParts.Joint5].children[0].position);
            parts[RobotParts.Joint5].add(tempGroup);
            tempGroup.attach(parts[RobotParts.Link5]);

            tempGroup = self.joints[5];
            tempGroup.name = "Joint6";
            tempGroup.position.copy(parts[RobotParts.Joint6].children[0].position);
            parts[RobotParts.Joint6].add(tempGroup);
            tempGroup.attach(parts[RobotParts.Flange]);

            // console.log(robot);

            self.model = robot;

            if (onLoad) onLoad(robot);
        } , onProgress, onError);
    }
}
