import * as turf from '@turf/turf';

class TreeStructure {
    constructor(name, minMax) {
        this.name = name
        this.numChildren = 4
        this.maxY = minMax["maxY"]
        this.minY = minMax["minY"]
        this.maxX = minMax["maxX"]
        this.minX = minMax["minX"]
        this.depth = this.calcDepth()
        this.intersections = null
        this.leafNodes = []
        this.root = new Node(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root")
        this.dissolved = null



    }
    
    ////Inital functions to call
    //Calculate depth of tree
    calcDepth(){
        let bottomLeft = [this.minY, this.minX]
        let bottomRight = [this.minY, this.maxX]
        let topLeft = [this.maxY, this.minX]

        let verticalDistance = this._calcDistance(bottomLeft, bottomRight)
        let horisontalDistance = this._calcDistance(bottomLeft, topLeft)

        let maxBorderCellSize = 2 //km
        let biggestDistance = Math.max(verticalDistance, horisontalDistance)
        console.log("biggestDistance", biggestDistance)
        let numFound = false
        let numCells = 1
        let depth
        while (!numFound){
            
            if (numCells*maxBorderCellSize > biggestDistance){
                numFound = true
            }
            numCells = numCells*2
            if(numCells == 16){
                numFound = true
            }

        }
        console.log("numCells", numCells)
        depth = Math.log(numCells*2)/Math.log(2)
        console.log("depth", depth)
        return depth
    }

    _calcDistance(coord1, coord2){
        let lat1 = coord1[0]
        let lon1 = coord1[1]

        let lat2 = coord2[0]
        let lon2 = coord2[1]

        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344
        return dist;
    }


    ////Functions to call after inital functions
    //Fill tree with layers
    fillTree(layers) {
        //For each layer
        for(let i = 0; i < layers.length; i++) {
            //Fill polygons in layer
            let layer = layers[i]
            for(let j = 0; j < layer.features.length; j++) {
                let polygon = layer.features[j]
                this.root.fillFeature(polygon)
            }
        }
    }

    _splitMultiPolygons(layer) {
        
        let features = layer.data.features
        let newFeatureCollection = turf.featureCollection([])
        //Fix multipolygons 
        for(let i = 0; i < features.length; i++) {
            let feature = features[i]
            if(feature.geometry.type === "MultiPolygon") {
                let newMulti = turf.multiPolygon([])
                let coordinates = feature.geometry.coordinates
                for(let c = 0; c < coordinates.length; c++) {
                    if(coordinates[c].length === 1) {
                        newMulti.geometry.coordinates.push(coordinates[c])
                    }else{
                        for(let cc = 0; cc < coordinates[c].length; cc++) {
                            newMulti.geometry.coordinates.push([coordinates[c][cc]])
                        }
                    }
                }
                newFeatureCollection.features.push(newMulti)
            }else{
                if(feature.geometry.coordinates.length !== 1) {
                    for(let c = 0; c < feature.geometry.coordinates.length; c++) {
                        let polygon = turf.polygon([feature.geometry.coordinates[c]])
                        newFeatureCollection.features.push(polygon)
                    }
                }else{
                    newFeatureCollection.features.push(feature)
                }
            }
                
        }
        layer.data = newFeatureCollection
        return layer
    }
    
    //Split layers up the tree into smaller layers for root nodes
    splitLayers() {
        this.root.splitLayers()
    }

    //Perform intersection on root nodes
    performIntersection() {
        this.root.intersection()
    }

    //Dissolve nodes from bottom of tree, and up
    dissolveNodes(){
        this.dissolved = this.root.dissolveNodes()
    }
    
}

export default TreeStructure

class Node {
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        this.depth = depth
        this.layers = []
        this.intersections = []
        this.union = null
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
        this.name = name
        this.treeStructure = treeStructure
        //Create Bounding box
        this.bbox = turf.bboxPolygon([minX, minY, maxX, maxY]);
        this.dissolved = null
        //Create Children
        if(this.depth > 1) {
            this.children = []
            let midX = (maxX + minX) / 2
            let midY = (maxY + minY) / 2
            let nextDepth = this.depth - 1
            //Left top
            this.children.push(new Node(treeStructure,numChildren, nextDepth, minX, midX, midY, maxY, "node"+nextDepth.toString()))
            //Left bottom
            this.children.push(new Node(treeStructure, numChildren, nextDepth, minX, midX, minY, midY, "node"+nextDepth.toString()))
            //Right top
            this.children.push(new Node(treeStructure, numChildren, nextDepth, midX, maxX, midY, maxY, "node"+nextDepth.toString()))
            //Right bottom
            this.children.push(new Node(treeStructure, numChildren, nextDepth, midX, maxX, minY, midY, "node"+nextDepth.toString()))
        }else{
            this.children = null
            this.treeStructure.leafNodes.push(this)
        }
        
    }

    fillFeature(feature) {
        // If no children, add feature to this node
        if(this.children === null) {
            this.layers.push(feature)
            // Create union of all layers in this node
            this._createUnion()
            return
        }
        // Get min and max coordinates of feature
        let minMaxCoordinates = this._getMinMaxCoordinates(feature)

        // Check if feature is inside of one of the child node
        for(let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            if(minMaxCoordinates[0] >= child.minX && minMaxCoordinates[1] <= child.maxX && minMaxCoordinates[2] >= child.minY && minMaxCoordinates[3] <= child.maxY) {
                child.fillFeature(feature)
                return
            }
        }
        // If not inside any child node, add to this node
        this.layers.push(feature)

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

    _createUnion() {
        // If no layers, set union to null
        if(this.layers.length === 0) {
            this.union = null
            return
        }
        // If one layer, transform to multipolygon and set as union
        if(this.layers.length === 1) {
            this.union = [turf.multiPolygon([this.layers[0].geometry.coordinates])]
            return
        }
        //// If more than one layer, create union of all layers
        // Split list of layers into two lists
        let firstHalf = this.layers.slice(0, Math.floor(this.layers.length/2))
        let secondHalf = this.layers.slice(Math.floor(this.layers.length/2), this.layers.length)

        // Transforms each half into a multipolygon
        let firstHalfMultiPolygon = turf.multiPolygon([])
        for(let i = 0; i < firstHalf.length; i++) {
            let coordinates = firstHalf[i].geometry.coordinates
            if(coordinates.length === 1) {
                firstHalfMultiPolygon.geometry.coordinates.push(coordinates)
            }else{
                for(let c = 0; c < coordinates.length; c++) {
                    firstHalfMultiPolygon.geometry.coordinates.push([coordinates[c]])
                }
            }
        }
        let secondHalfMultiPolygon = turf.multiPolygon([])
        for(let i = 0; i < secondHalf.length; i++) {
            let coordinates = secondHalf[i].geometry.coordinates
            if(coordinates.length === 1) {
                secondHalfMultiPolygon.geometry.coordinates.push(coordinates)
            }else{
                for(let c = 0; c < coordinates.length; c++) {
                    secondHalfMultiPolygon.geometry.coordinates.push([coordinates[c]])
                }
            }
        }

        // Perform union between the two multipolygons
        let union = turf.union(firstHalfMultiPolygon, secondHalfMultiPolygon)

        // If union is a polygon, transform to multipolygon
        if(union.geometry.type === "Polygon") {
            union = turf.multiPolygon([union.geometry.coordinates])
        }
        
        // Set new union
        this.union =[union]
    }

    // Split layers into chunks for root nodes
    splitLayers() {
        // If at root node, return 
        if(this.children === null) {
            return
        }
        // if not at root node, split every layer in this node into chunks and send to children
        while(this.layers.length !== 0) {
            let layer = this.layers.pop()

            //For every child, check if layer is inside child
            for(let i = 0; i < this.children.length; i++) {
                //Bounding box of child
                let bbox = this.children[i].bbox
                //Clip layer to bounding box
                let intersection = turf.intersect(layer, bbox);
                //If layer is inside child, send to child
                if(intersection !== null) {
                    this.children[i].layers.push(intersection)
                }
            }
        }
        //For each child, split layer split layers
        for(let j = 0; j < this.children.length; j++) {
            this.children[j].splitLayers()
        }
    }



    //// Perform intersection (second version)
    // Only need to perform intersection on root nodes
    intersection() {
        // If at root node, perform intersection
        if(this.children === null) {
            if(this.layers.length === 0) {
                return
            }
            //Split multipolygons into polygons
            this._splitMultiPolygons()
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
        // If node are empty, return
        if(layers.length === 0) {
            return
        }

        let intersections = []
        let checked = []
        for(let i = 0; i < layers.length; i++) {
            for(let j = i; j < layers.length; j++) {
                let fL = layers[i]
                let sL = layers[j]
                if(i === j) {
                    continue
                }

                let intersection = turf.intersect(fL, sL)
                if(intersection !== null) {
                    if(intersection.geometry.type === "MultiPolygon") {
                        let coordinates = intersection.geometry.coordinates
                        for(let c = 0; c < coordinates.length; c++) {
                            let polygon = turf.polygon(coordinates[c])
                            intersections.push(polygon)
                        }
                    }else{
                        intersections.push(intersection)
                    }
                }

            }
        }
        // console.log("intersections", intersections)
        this.layers = intersections
        //Dissolve layers in node
        this._dissolve(intersections)
       
    }
    _splitMultiPolygons() {
        let layers = this.layers
        let newLayers = []
        for(let i = 0; i < layers.length; i++) {
            let layer = layers[i]
            if(layer.geometry.type === "Polygon") {
                newLayers.push(layer)
                continue
            }
            let geometry = layer.geometry
            for(let c = 0; c < geometry.coordinates.length; c++) {
                let polygon = turf.polygon(geometry.coordinates[c])
                newLayers.push(polygon)
            }
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



    //Dissolve nodes from bottom of tree, and up
    dissolveNodes(){
        // If at root node
        if(this.children === null){
            return this.dissolved
        }
        //Dissolve children
        let childrenDissolved = []
        for(let i = 0; i < this.children.length; i++){
            let dissolvedChild = this.children[i].dissolveNodes()
            // console.log("dissolvedChild",this.name, dissolvedChild)
            if(dissolvedChild !== null){
                childrenDissolved.push(dissolvedChild)
            }
        }
        //If every children empty, return null
        if(childrenDissolved.length === 0){
            return null
        }
        //Dissolve layers in child nodes
        if(childrenDissolved.length === 1){
            return childrenDissolved[0]
        }
        let dissolved = childrenDissolved[0]
        for(let i = 1; i < childrenDissolved.length; i++){
            let childFeatureCollection = childrenDissolved[i]
            //Combine two childrens featureCollections to one featurecollection
            let featureCollection = this._combineFeatureCollections(dissolved, childFeatureCollection)
            //Dissolve featureCollection
            // console.log("featureCollection", featureCollection)
            dissolved = turf.dissolve(featureCollection)
        }
        this.dissolved = dissolved
        return dissolved

    }

    _combineFeatureCollections(featureCollection1, featureCollection2){
        let features = featureCollection1.features.concat(featureCollection2.features)
        let newFeatureCollection = turf.featureCollection(features)
        return newFeatureCollection
    }

}