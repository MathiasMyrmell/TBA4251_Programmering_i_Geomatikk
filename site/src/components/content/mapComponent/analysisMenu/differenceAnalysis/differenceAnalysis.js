import TreeStructure from '../intersectAnalysis/treeStructure.js';
import {max, min} from 'lodash';

function differenceAnalysis(layers) {

    //Find min and max values
    let minMax = _findMinMax(layers)

    //Create tree structure
    const tree = new TreeStructure("difference", minMax)
    console.log("empty tree", tree)

    //Fill tree structure with layers
    console.log("---Filling tree---")
    tree.fillTreeDifference(layers)
    console.log("Filled tree", tree)
    //Ok til here

    //Split layers to fit child nodes, until there is only layers in leaf nodes
    console.log("---Split layers---")
    tree.splitLayersDifference()
    console.log("Splitted layers", tree)

    //Dissolve layers in leaf nodes
    console.log("---Dissolving leaf nodes---")
    tree.dissolveLeafNodes()
    console.log("Leafnodes dissolved", tree)
    //FUNKER FRAM TIL HIT

    //Perform difference analysis in each leaf node
    console.log("---Difference on nodes---")
    tree.performDifference()
    console.log("Difference on nodes", tree)
    //Funker fram til hit

    //Dissolve nodes from bottom to top, until there is only one layer in root node
    console.log("---Combine nodes---")
    tree.dissolveNodesDifference()
    console.log("nodes combined", tree)
    //BI FEIL HER

    return tree

}

function _findMinMax(layers){
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
    let bbox = {"minX": min(minMax["minX"]), "maxX": max(minMax["maxX"]), "minY": min(minMax["minY"]), "maxY": max(minMax["maxY"])}
    return bbox
}

export default differenceAnalysis;