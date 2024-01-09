import TreeStructure from '../treeStructure.js';
import Node from '../node.js';
import {max, min} from 'lodash'; 
import * as turf from '@turf/turf';

class DiffAnalysis {
    constructor(layers){
        this.layers = layers
        this.minMax = this._findMinMax(layers)
        this.result = null
        this.performDifference()
    } 
    
    performDifference() {
    
        //Create tree structure
        const tree = new DifferenceTree("difference", this.minMax)
     
        //Fill tree structure with layers
        console.log("---Filling tree---")
        tree.fillTree(this.layers)
        console.log("Filled tree", tree)
    
        //Split layers to fit child nodes, until there is only layers in leaf nodes
        console.log("---Split layers---")
        tree.splitLayers()
        console.log("Splitted layers", tree)
    
        //Dissolve layers in leaf nodes
        console.log("---Dissolving leaf nodes---")
        tree.dissolveLeafNodes()
        console.log("Leafnodes dissolved", tree)
    
        //Perform difference analysis in each leaf node
        console.log("---Difference on nodes---")
        tree.performDifference()
        console.log("Difference on nodes", tree)
    
        //Dissolve nodes from bottom to top, until there is only one layer in root node
        console.log("---Combine nodes---")
        tree.dissolveNodes()
        console.log("nodes combined", tree)
    
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
        let bbox = {"minX": min(minMax["minX"]), "maxX": max(minMax["maxX"]), "minY": min(minMax["minY"]), "maxY": max(minMax["maxY"])}
        return bbox
    }
}


export default DiffAnalysis;

class DifferenceTree extends TreeStructure {
    constructor(name, minMax) {
        super(name, minMax)
        this.root = new DifferenceNode(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root")
    }

    performDifference(){
        this.root.difference()
    }
}

class DifferenceNode extends Node{
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        super(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name)
        this.intersections = []

        //Create Children
        if(this.depth > 1) {
            let midX = (maxX + minX) / 2
            let midY = (maxY + minY) / 2
            let nextDepth = this.depth - 1
            //Left top 
            this.children.push(new DifferenceNode(treeStructure,numChildren, nextDepth, minX, midX, midY, maxY, "node"+nextDepth.toString()))
            //Left bottom
            this.children.push(new DifferenceNode(treeStructure, numChildren, nextDepth, minX, midX, minY, midY, "node"+nextDepth.toString()))
            //Right top
            this.children.push(new DifferenceNode(treeStructure, numChildren, nextDepth, midX, maxX, midY, maxY, "node"+nextDepth.toString()))
            //Right bottom
            this.children.push(new DifferenceNode(treeStructure, numChildren, nextDepth, midX, maxX, minY, midY, "node"+nextDepth.toString()))
        }else{
            this.children = null
            this.treeStructure.leafNodes.push(this)
        }
    }

    difference(){
        //If at leaf node, perform difference
        if(this.children === null){
            if(this.layers[0].length === 0){
                return
            }
            //Perform difference
            this._internalDifference()
            return
        }
        //If not at leaf node, continue down
        for(let i = 0; i < this.children.length; i++){
            this.children[i].difference()
        }
    }

    _internalDifference(){
        let layers0 = this.layers[0]
        let layers1 = this.layers[1]

        //If only the first layer has features, keep this
        if(layers0.length > 0 && layers1.length === 0){
            // console.log("Returning dissolved layer0")
            let dissolved = turf.dissolve(turf.featureCollection(layers0))
            this.analysisResult = dissolved.features
            return
        }

        let differences = []
        //For each polygon in layers0
        for(let l=0; l<layers0.length; l++){
            let polygon0 = layers0[l]
            // Find difference between polygon1 and all polygons in polygons2
            let diff = []
            for(let i = 0; i<layers1.length; i++){
                let polygon1 = layers1[i]
                let difference = turf.difference(polygon0, polygon1)
                //If difference is null, continue to next polygon
                if(difference === null){
                    continue
                }
                //If difference is a polygon/multipolygon, add to diff
                diff.push(difference)

            }
            // Perform intersection between every differences
            //If no differences, continue to next layer
            if(diff.length === 0){
                continue
            }
            let intersection = diff.pop()
            for(let i = 0; i<diff.length;i++){
                let newIntersection = turf.intersect(intersection, diff[i])
                intersection = newIntersection
            }

            // Add result to list of every difference in node
            if(intersection.geometry.type === "Polygon"){
                differences.push(intersection)
            }else if(intersection.geometry.type === "MultiPolygon"){
                let coordinates = intersection.geometry.coordinates
                for(let c = 0; c <coordinates.length; c++){
                    let polygon = turf.polygon(coordinates[c])
                    differences.push(polygon)
                }
            }
        }

        //differences should be x number of polygons, whom are not intersecting. 
        //Only needs to be dissolved
        if(differences.length<1){
            this.analysisResult = null
            return
        }

        //When differences are found, these polygons should not overlap
        //Therefore, dissolve should not loose any data
        let fC = turf.featureCollection(differences)
        let dissolved = turf.dissolve(fC)
        this.analysisResult = dissolved.features
    }
}

