import TreeStructure from "../treeStructure";
import Node from "../node";
import {max, min} from 'lodash';
import * as turf from '@turf/turf';

class IntersectionAnalysis {
    constructor(layers){
        this.layers = layers
        this.minMax = this._findMinMax(layers)
        this.result = null
        this.performIntersection()
    } 
 
    performIntersection(){
        //Create tree structure
        const tree = new IntersectionTree("intersection", this.minMax)
         
        //Fill tree structure with layers
        tree.fillTree(this.layers)
    
        //Split layers to fit child nodes, until there is only layers in leaf nodes
        tree.splitLayers()
    
        // //Dissolve layers in leaf nodes
        tree.dissolveLeafNodes()
    
        //Perform difference analysis in each leaf node
        tree.performIntersect()
    
        //Dissolve nodes from bottom to top, until there is only one layer in root node
        tree.dissolveNodes()

        //Set result
        console.log("result", tree.dissolved)
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


class IntersectionNode extends Node{
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        super(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name)
        this.intersections = []
        //Create Children
        if(this.depth > 1) {
            let midX = (maxX + minX) / 2
            let midY = (maxY + minY) / 2
            let nextDepth = this.depth - 1
            //Left top 
            this.children.push(new IntersectionNode(treeStructure,numChildren, nextDepth, minX, midX, midY, maxY, "node"+nextDepth.toString()))
            //Left bottom
            this.children.push(new IntersectionNode(treeStructure, numChildren, nextDepth, minX, midX, minY, midY, "node"+nextDepth.toString()))
            //Right top
            this.children.push(new IntersectionNode(treeStructure, numChildren, nextDepth, midX, maxX, midY, maxY, "node"+nextDepth.toString()))
            //Right bottom
            this.children.push(new IntersectionNode(treeStructure, numChildren, nextDepth, midX, maxX, minY, midY, "node"+nextDepth.toString()))
        }else{
            this.children = null
            this.treeStructure.leafNodes.push(this)
        }
        
    }


    //// Perform intersection
    // Only need to perform intersection on root nodes
    intersection() {
        // If at root node, perform intersection
        if(this.children === null) {
            if(this.layers.length === 0) {
                return
            }
            //Split multipolygons into polygons
            this._createMultipolygons()

            //Perform intersection
            this._internalIntersection()
            return
        }

        for(let i = 0; i < this.children.length; i++) {
            this.children[i].intersection()
        }
        
    }

    _internalIntersection() {
        let layers = this.layers
        //If both layers are empty, return
        if(layers.length === 0) {
            return
        }
        //If one of the layers are empty, return
        if(layers.length === 1) {
            //Finn ut ka som skal gjøres her
            return
        }
        let intersection = turf.intersect(layers[0], layers[1])
        if(intersection === null){
            this.analysisResult = null
            return
        }
        this.analysisResult = [intersection]
    }
    _createMultipolygons() {
        let layers = this.layers
        let newLayers = []
        for(let i = 0; i<layers.length; i++){
            let layer = layers[i]
            if(layer.length === 0){
                continue
            }
            if(layers.length === 1){
                newLayers[i] = layer
                continue
            }
            let multiPolygon = turf.multiPolygon([])
            for(let j = 0; j<layer.length; j++){
                let features = layer[j]
                if(features.geometry.type === "Polygon"){
                    multiPolygon.geometry.coordinates.push(features.geometry.coordinates)
                }
            }
            newLayers.push(multiPolygon)
        }
        this.layers = newLayers
    }


    
    _dissolve(layers) {
        if(layers.length === 0) {
            return
        }
        //Create featurecollection
        let newFeatureCollection = turf.featureCollection(layers)
        //Dissolve layers
        let dissolved = turf.dissolve(newFeatureCollection)
        this.dissolved = dissolved
    }

}

class IntersectionTree extends TreeStructure {
    constructor(name, minMax) {
        super(name, minMax)
        this.root = new IntersectionNode(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root")
    }

    //Perform intersection on root nodes
    performIntersect() {
        this.root.intersection()
    }
    
}
