import * as turf from '@turf/turf';

class BuffAnalysis {
    constructor(layer, bufferDistance){
        this.layer = layer
        this.bufferDistance = bufferDistance
        this.minMax = this._findMinMax(layer, bufferDistance)
        this.result = null
        this.performBuffer()
    }

    performBuffer() {
        //Create tree structure
        const tree = new BufferTree("buffer", this.minMax, this.bufferDistance)

        //Fill tree structure with layer
        tree.fillTree(this.layer)

        //Split layers to fit child nodes, until there is only layers in leaf nodes
        tree.splitLayers()

        //Dissolve layers in leaf nodes
        tree.dissolveLeafNodes()

        //Perform Buffer analysis in each leaf node
        tree.performBuffer()
        if(tree.stopAnalysis){
            this.result = null
            return
        }
        //Dissolve nodes from bottom to top, until there is only one layer in root node
        tree.dissolveNodes()
        if(tree.stopAnalysis){
            this.result = null
            return
        }
        this.result = tree.dissolved
    }

    _findMinMax(layer, bufferDistance){
        let minMax = {"minX":Infinity, "maxX":-Infinity, "minY":Infinity, "maxY":-Infinity}
        let features = layer.features
        for(let j = 0; j<features.length; j++){
            let feature = features[j]
            let coordinates = feature.geometry.coordinates
            if(coordinates.length === 1){
                for(let c = 0; c < coordinates[0].length; c++){
                    let coordinate = coordinates[0][c]
                    let x = coordinate[0]
                    let y = coordinate[1]
                    if(x > minMax["maxX"]){
                        minMax["maxX"] = x
                    }
                    if(x < minMax["minX"]){
                        minMax["minX"] = x
                    }
                    if(y > minMax["maxY"]){
                        minMax["maxY"] = y
                    }
                    if(y < minMax["minY"]){
                        minMax["minY"] = y
                    }
                }
            }else{
                for(let c = 0; c<coordinates.length; c++){
                    for(let d = 0; d<coordinates[c].length; d++){
                        let coordinate = coordinates[c][d]
                        let x = coordinate[0]
                        let y = coordinate[1]
                        if(x > minMax["maxX"]){
                            minMax["maxX"] = x
                        }
                        if(x < minMax["minX"]){
                            minMax["minX"] = x
                        }
                        if(y > minMax["maxY"]){
                            minMax["maxY"] = y
                        }
                        if(y < minMax["minY"]){
                            minMax["minY"] = y
                        }
                    }
                }
            }
        }
        //Add/subtract buffer distance to min/max coordinates, to make sure all features are inside the tree
        let offsetX = (bufferDistance/6371000)*(180/Math.PI)/Math.cos(minMax["minY"]*(Math.PI/180))
        let offsetY = (bufferDistance/6371000)*(180/Math.PI)
        minMax["minX"] -= offsetX
        minMax["maxX"] += offsetX
        minMax["minY"] -= offsetY
        minMax["maxY"] += offsetY
        let bbox = {"minX": minMax["minX"], "maxX": minMax["maxX"], "minY": minMax["minY"], "maxY": minMax["maxY"]}
        return bbox

    }
}

export default BuffAnalysis;


class BufferTree {
    constructor(name, minMax, bufferDistance) {
        this.name = name
        this.numChildren = 4
        this.maxY = minMax["maxY"]
        this.minY = minMax["minY"] 
        this.maxX = minMax["maxX"]
        this.minX = minMax["minX"]
        this.depth = this.calcDepth()
        this.leafNodes = []
        this.dissolved = null
        this.root = new BufferNode(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root", bufferDistance)
        this.stopAnalysis = false
    }
    performBuffer(){
        this.root.buffer()
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
        depth = Math.log(numCells*2)/Math.log(2)
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

    // Fill tree with layers 
    fillTree(layer) {
        for(let i = 0; i < layer.features.length; i++) {
            let polygon = layer.features[i]
            this.root.fillFeature(polygon)
        }
    }

    //Split layers high up the tree into smaller layers for root nodes
    splitLayers() {
        this.root.splitLayers()
    }

    //Dissolve layers in leafnodes
    dissolveLeafNodes(){
        //For each leafnode
        for(let i = 0; i<this.leafNodes.length; i++){
            let leafNode = this.leafNodes[i]
            //For each layer in node, dissolve layer
            let layer = leafNode.layers
            if(layer.length<=1){
                continue
            }
            let fC = turf.featureCollection(layer)
            //Dissolve
            let dissolved = turf.dissolve(fC)
            this.leafNodes[i].layers = dissolved.features
        }
    }

    //Dissolve nodes from bottom of tree, and up
    dissolveNodes(){
        this.dissolved = this.root.dissolveNodes()
    }
}


class BufferNode {
    constructor(treeStructure, numChildren, depth, minX, maxX, minY, maxY, name, bufferDistance) {
        this.treeStructure = treeStructure
        this.numChildren = numChildren
        this.depth = depth
        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
        this.name = name
        this.union = null
        this.bufferDistance = bufferDistance
        this.bbox = turf.bboxPolygon([minX, minY, maxX, maxY]);
        this.children = []
        this.layers = []
        this.analysisResult = null
        //Create children
        if(this.depth>1){
            let midX = (maxX + minX) / 2
            let midY = (maxY + minY) / 2
            let nextDepth = this.depth - 1
            //Left top 
            this.children.push(new BufferNode(treeStructure,numChildren, nextDepth, minX, midX, midY, maxY, "node"+nextDepth.toString(), bufferDistance))
            //Left bottom
            this.children.push(new BufferNode(treeStructure, numChildren, nextDepth, minX, midX, minY, midY, "node"+nextDepth.toString(), bufferDistance))
            //Right top
            this.children.push(new BufferNode(treeStructure, numChildren, nextDepth, midX, maxX, midY, maxY, "node"+nextDepth.toString(), bufferDistance))
            //Right bottom
            this.children.push(new BufferNode(treeStructure, numChildren, nextDepth, midX, maxX, minY, midY, "node"+nextDepth.toString(), bufferDistance))
        }else{
            this.children = null
            this.treeStructure.leafNodes.push(this)
        }
    }

    ////Functions for difference analysis
    fillFeature(feature){
        // If no children, add feature to this node
        if(this.children === null) {
            this.layers.push(feature)
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

    // Split layers into chunks for root nodes
    splitLayers(){
        // If at root node, return 
        if(this.children === null) {
            return
        }
        // if not at root node, split every layer in this node into chunks and send to children
        let layers = this.layers
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
                        this.children[i].layers.push(intersection)
                    }else{//If it is a multipolygon
                        let coordinates = intersection.geometry.coordinates
                        for(let j=0; j<coordinates.length;j++){
                            let newPoly = turf.polygon(coordinates[j])
                            this.children[i].layers.push(newPoly)
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
        if(this.treeStructure.stopAnalysis){
            return null
        }
        //If at leaf node
        if(this.children === null){
            if(this.analysisResult !== null){
                return turf.featureCollection(this.analysisResult)
            }
            return null
        }
        
        //Dissolve every children in node, and return to parent node
        let dataFromChildren = []
        for(let c = 0; c <this.children.length; c++){
            if(this.treeStructure.stopAnalysis){
                break
            }
            let data = this.children[c].dissolveNodes()
            if(data !== null){
                dataFromChildren.push(data)
            }
        }

        //If no data, return null
        if(dataFromChildren.length === 0){
            return null
        }

        //If only one featureCollection, return this
        if(dataFromChildren.length === 1){
            return dataFromChildren[0]
        }

        //If more than one featureCollection, merge featureCollections and dissolve them
        //Merge
        let combinedFeatureCollections = this._combineFeatureCollectionsDifference(dataFromChildren)
        //Dissolve
        let dissolved
        try{
            dissolved = turf.dissolve(combinedFeatureCollections)
        }
        catch(error){
            console.log("error", error)
            this.treeStructure.stopAnalysis = true
            return combinedFeatureCollections
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
                    newFeatureCollection.features.push(feature)
                    continue
                }

                //If feature is a multipolygon, split into polygons and add to featurecollection
                let coordinates = feature.geometry.coordinates
                for(let c = 0; c < coordinates.length; c++){
                    let polygon = turf.polygon(coordinates[c])
                    featureCollection.features.push(polygon)
                }
            }
        }
        return newFeatureCollection
    }
   
    buffer(){
        //If at lead node, perform buffer
        if(this.children === null){
            this._internalBuffer()
            return
        }
        //If not at leaf node, buffer children
        for(let i = 0; i<this.children.length; i++){
            this.children[i].buffer()
        }
    }

    _internalBuffer(){
        if(this.treeStructure.stopAnalysis){
            return null
        }
        let layer = this.layers
        //If no layers, return
        if(layer.length === 0){
            return
        }
        let buffers = []
        for(let i = 0; i< layer.length; i++){
            let feature = layer[i]
            let buffered = turf.buffer(feature, this.bufferDistance, {units: 'meters'})
            buffers.push(buffered)
        }

        //If only one or zero buffers, return this
        if(buffers.length < 1){
            return
        }
        //Check for multipolygons, and split them into polygons
        let splittedBuffers = this._splitMultiPolygon(turf.featureCollection(buffers))

        //If more than one buffer, dissolve buffers
        let dissolved
        try{
            dissolved = turf.dissolve(splittedBuffers)
            this.analysisResult = dissolved.features

        }
        catch(error){
            console.log("error", error)
            this.treeStructure.stopAnalysis = true
            return null
        }

    }

    _splitMultiPolygon(layer){
        let featureCollection = turf.featureCollection()
        let newFeatures = []
        for(let i = 0; i<layer.features.length; i++){
            let feature = layer.features[i]
            if(feature.geometry.type == "MultiPolygon"){
                for(let j = 0; j<feature.geometry.coordinates.length; j++){
                    let polygon = turf.polygon(feature.geometry.coordinates[j])
                    newFeatures.push(polygon)
                }
            }else{
                newFeatures.push(feature)
            }
        }
        featureCollection.features = newFeatures
        return featureCollection
      }


}


