import TreeStructure from "../treeStructure";
import Node from "../node";
import {max, min} from 'lodash';
import * as turf from '@turf/turf';

class UAnalysis{
    constructor(layers){
        this.layers = layers
        this.minMax = this._findMinMax(layers)
        this.result = null
        this.performUnion()
    }
 
    performUnion(){
        //Create tree structure
        const tree = new UnionTree("union", this.minMax)
     
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
        console.log("---Union on nodes---")
        tree.performUnion()
        console.log("Union on nodes", tree)
    
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

export default UAnalysis

class UnionTree extends TreeStructure {
    constructor(name, minMax) {
        super(name, minMax)
        this.root = new UnionNode(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root")
    }

    performUnion(){
        this.root.unionA()
    }
}

class UnionNode extends Node {
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        super(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name)
        this.intersections = []

        //Create Children
        if(this.depth > 1) {
            let midX = (maxX + minX) / 2
            let midY = (maxY + minY) / 2
            let nextDepth = this.depth - 1
            //Left top 
            this.children.push(new UnionNode(treeStructure,numChildren, nextDepth, minX, midX, midY, maxY, "node"+nextDepth.toString()))
            //Left bottom
            this.children.push(new UnionNode(treeStructure, numChildren, nextDepth, minX, midX, minY, midY, "node"+nextDepth.toString()))
            //Right top
            this.children.push(new UnionNode(treeStructure, numChildren, nextDepth, midX, maxX, midY, maxY, "node"+nextDepth.toString()))
            //Right bottom
            this.children.push(new UnionNode(treeStructure, numChildren, nextDepth, midX, maxX, minY, midY, "node"+nextDepth.toString()))
        }else{
            this.children = null
            this.treeStructure.leafNodes.push(this)
        }
    }

    unionA(){
        //If at leaf node, perform union
        if(this.children === null){
            if(this.layers[0].length === 0){
                return
            }
            //Perform difference
            this._internalUnion()
            return
        }
        //If not at leaf node, continue down
        for(let i = 0; i < this.children.length; i++){
            this.children[i].unionA()
        }
    }

    _internalUnion(){
        let layers = this.layers
        //If both layers empty, return
        if(layers[0].length === 0 && layers[1].length === 0){
            return
        }

        //If one layer empty, return this layer
        if(layers[0].length === 0){
            this.analysisResult = layers[1]
            return
        }else if(layers[1].length === 0){
            this.analysisResult = layers[0]
            return
        }

        //If both layers have features, perform union
        let unions = []
        for(let i = 0; i<layers[0].length; i++){
            let layer1 = layers[0][i]
            for(let j = 0; j<layers[1].length; j++){
                let layer2 = layers[1][j]
                // console.log("layer1", layer1)
                // console.log("layer2", layer2)
                let union = turf.union(layer1.geometry, layer2.geometry)
                // console.log("union", union)
                unions.push(union)
            }
        }
        let result = this._splitMultiPolygons(unions)
        this.analysisResult = result
    }

    _splitMultiPolygons(features){
        let newFeatures = []
        for(let i = 0; i<features.length; i++){
            let feature = features[i]
            //If feature is polygon, add it to newFeatures
            if(feature.geometry.type === "Polygon"){
                newFeatures.push(feature)
                continue
            }

            //If feature is multipolygon, split it into polygons and add them to newFeatures
            let coordinates = feature.geometry.coordinates
            for(let j = 0; j<coordinates.length; j++){
                let newFeature = turf.polygon(coordinates[j])
                newFeatures.push(newFeature)
            }
        }

        return newFeatures
    }
}