import TreeStructure from "./treeStructure";
import {max, min} from 'lodash';

class IntersectionAnalysis {
    constructor(layers){
        this.layers = layers
        this.minMax = this._findMinMax(layers)
        this.result = null
    }

    performIntersection(){
        //Create tree structure
        const tree = new TreeStructure("intersection", this.minMax)
        console.log("empty tree", tree)
        
        //Fill tree structure with layers
        console.log("tree filled")
        tree.fillTree(this.layers)
        console.log("Filled tree", tree)

        //Split layers to fit child nodes, until there is only layers in leaf nodes
        console.log("Split layers")
        tree.splitLayers()
        console.log("Splitted layers", tree)

        //Perform intersection in leaf nodes
        console.log("Intersect on layers")
        tree.performIntersection()
        console.log("Intersected layers", tree)

        //Dissolve nodes from bottom to top, until there is only one layer in root node
        console.log("Combine nodes")
        tree.dissolveNodes()
        console.log("Combined nodes", tree)

        //Set result
        this.result = tree.dissolved
    }


    _findMinMax(layers){
        let minMax = {"minX":[], "maxX":[], "minY":[], "maxY":[]}
        for(let i = 0; i<layers.length; i++){
            let features = layers[i].features
            let minX = Infinity
            let maxX = -Infinity
            let minY = Infinity
            let maxY = -Infinity
            for(let j = 0; j<features.length; j++){
                let feature = features[j]
                let coordinates = feature.geometry.coordinates
                if(coordinates.length === 1){
                    for(let c = 0; c < coordinates[0].length; c++){
                        let coordinate = coordinates[0][c]
                        let x = coordinate[0]
                        let y = coordinate[1]
                        if(x > maxX){
                            maxX = x
                        }
                        if(x < minX){
                            minX = x
                        }
                        if(y > maxY){
                            maxY = y
                        }
                        if(y < minY){
                            minY = y
                        }
                    }
                }else{
                    for(let c = 0; c<coordinates.length; c++){
                        for(let d = 0; d<coordinates[c].length; d++){
                            let coordinate = coordinates[c][d]
                            let x = coordinate[0]
                            let y = coordinate[1]
                            if(x > maxX){
                                maxX = x
                            }
                            if(x < minX){
                                minX = x
                            }
                            if(y > maxY){
                                maxY = y
                            }
                            if(y < minY){
                                minY = y
                            }
                        }
                    }
                }
            }
            minMax["minX"].push(minX)
            minMax["maxX"].push(maxX)
            minMax["minY"].push(minY)
            minMax["maxY"].push(maxY)
        }
        let bbox = {"minX": max(minMax["minX"]), "maxX": min(minMax["maxX"]), "minY": max(minMax["minY"]), "maxY": min(minMax["maxY"])}
        return bbox
    }


}

export default IntersectionAnalysis;


