import * as turf from '@turf/turf'
import _ from 'lodash'

class Node {
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        this.treeStructure = treeStructure
        this.numChildren = numChildren
        this.depth = depth
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
        this.name = name
        this.union = null
        this.bbox = turf.bboxPolygon([minX, minY, maxX, maxY]);
        this.children = []
        this.layers = [[],[]]
        this.analysisResult = null

    }

    ////Functions for difference analysis
    fillFeature(feature, index){
        // If no children, add feature to this node
        if(this.children === null) {
            this.layers[index].push(feature)
            // Create union of all layers in this node
            return
        }
        // Get min and max coordinates of feature
        let minMaxCoordinates = this._getMinMaxCoordinates(feature)

        // Check if feature is inside of one of the child node
        for(let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            if(minMaxCoordinates[0] >= child.minX && minMaxCoordinates[1] <= child.maxX && minMaxCoordinates[2] >= child.minY && minMaxCoordinates[3] <= child.maxY) {
                child.fillFeature(feature, index)
                return
            }
        }
        // If not inside any child node, add to this node
        this.layers[index].push(feature)
    }


    _getMinMaxCoordinates(feature) {
        let minX = 0;
        let maxX = 0;
        let minY = 0;
        let maxY = 0;

        let coordinates = feature.geometry.coordinates[0]
        minX = coordinates[0][0]
        maxX = coordinates[0][0]
        minY = coordinates[0][1]
        maxY = coordinates[0][1]
        for(let i = 1; i < coordinates.length; i++) {
            let x = coordinates[i][0]
            let y = coordinates[i][1]
            if(x < minX) {
                minX = x
            }else if(x > maxX) {
                maxX = x
            }
            if(y < minY) {
                minY = y
            }else if(y > maxY) {
                maxY = y
            }
        }
        return [minX, maxX, minY, maxY]
    }

    // Split layers into chunks for root nodes
    splitLayers(){
        // If at root node, return 
        if(this.children === null) {
            return
        }
        // if not at root node, split every layer in this node into chunks and send to children
        // console.log("this.layers", this.layers)
        for(let index = 0; index < this.layers.length; index++) {
            let layers = this.layers[index]
            if(layers.length === 0) {
                // console.log("layers0", layers)
                continue
            }
            while(layers.length !== 0) {
                let layer = layers.pop()
    
                //For every child, check if layer is inside child
                for(let i = 0; i < this.children.length; i++) {
                    //Bounding box of child
                    let bbox = this.children[i].bbox
                    //Clip layer to bounding box
                    let intersection = turf.intersect(layer, bbox);
                    //If layer is inside child, send to child
                    if(intersection !== null) {
                        if(intersection.geometry.type === "Polygon"){
                            this.children[i].layers[index].push(intersection)
                        }else{//If it is a multipolygon
                            let coordinates = intersection.geometry.coordinates
                            for(let j=0; j<coordinates.length;j++){
                                let newPoly = turf.polygon(coordinates[j])
                                this.children[i].layers[index].push(newPoly)
                            }
                        }
                    }
                }
            }
        }
        //For each child, split layer
        for(let j = 0; j < this.children.length; j++) {
            this.children[j].splitLayers()
        }
    }

    dissolveNodes(){
        //If at root node
        if(this.children === null){
            if(this.analysisResult !== null){
                return turf.featureCollection(this.analysisResult)
            }
            return null
        }
        
        //Dissolve every children in node, and return to parent node
        let dataFromChildren = []
        for(let c = 0; c <this.children.length; c++){
            let data = this.children[c].dissolveNodes()
            if(data !== null){
                dataFromChildren.push(data)
            }
        }
        // console.log("--data"+this.name, dataFromChildren)
        //If no data, return null
        if(dataFromChildren.length === 0){
            // console.log("returning null")
            return null
        }

        //If only one featureCollection, return this
        if(dataFromChildren.length === 1){
            // console.log("Returning ", dataFromChildren, dataFromChildren[0])
            return dataFromChildren[0]
        }

        //If more than one featureCollection, merge featureCollections and dissolve them
        //Merge
        let combinedFeatureCollections  = this._combineFeatureCollectionsDifference(dataFromChildren)
        
        //Dissolve
        //TODO: Finn ut av dette
        //ligger inne issues på githuben demmes om at denne ikke funker
        let dissolved
        try{
            dissolved = turf.dissolve(combinedFeatureCollections)
        }
        catch(error){
            console.log("error", error)
            return null
        }
        return dissolved
    }

    //Combines two featurecollections
    //Splits multipolygons into polygons
    _combineFeatureCollectionsDifference(featureCollections){
        let newFeatureCollection = turf.featureCollection([])
        //For each featurecollection
        for(let i = 0; i < featureCollections.length; i++){
            let featureCollection = featureCollections[i]
            //For each feature in featurecollection
            for(let j = 0; j < featureCollection.features.length; j++){
                let feature = featureCollection.features[j]
               
                //If feature is a polygon, add to featurecollection 
                if(feature.geometry.type === "Polygon"){
                    // console.log("polygon", feature)
                    newFeatureCollection.features.push(feature)
                    continue
                }

                //If feature is a multipolygon, split into polygons and add to featurecollection
                let coordinates = feature.geometry.coordinates
                for(let c = 0; c < coordinates.length; c++){
                    let polygon = turf.polygon(coordinates[c])
                    // console.log("newPolygon",polygon)
                    featureCollection.features.push(polygon)
                }
            }
        }
        return newFeatureCollection
    }
}

export default Node