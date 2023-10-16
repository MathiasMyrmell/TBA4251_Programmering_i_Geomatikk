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
        this.leafNodes = []
        this.root = new Node(this, this.numChildren, this.depth, this.minX, this.maxX, this.minY, this.maxY, "root")
        if(name === "intersection"){
            this.intersections = null
            this.dissolved = null
        }else if(name === "difference"){
           this.difference = null
        }else if(name === "union"){
            this.union = null
        }
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

    ////Functions for intersection analysis
    //Fill tree with layers
    fillTree(layers) {
        console.log("fillTree layers", layers)
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
    

    ////Functions for difference analysis
    //Fill tree with layers
    fillTreeDifference(layers) {
        console.log("fillTreeDifference layers", layers)
        // let index = 0
        // console.log("layers", layers)
        //For each layer
        for(let i = 0; i< layers.length; i++){
            let layer = layers[i]
            //Fill each feature in layer
            let features = layer.features
            for(let j = 0; j<features.length; j++){
                let feature = features[j]
                this.root.fillFeatureDifference(feature, i)
            }
            // index+=1
        }
    }

    splitLayersDifference(){
        this.root.splitLayersDifference()
    }

    dissolveLeafNodes(){
        //For each leafnode
        for(let i = 0; i<this.leafNodes.length; i++){
            let leafNode = this.leafNodes[i]
            //For each layer in node, dissolve layer
            for(let j = 0; j<leafNode.layers.length; j++){
                let layer = leafNode.layers[j]
                if(layer.length<=1){
                    continue
                }
                let fC = turf.featureCollection(layer)
                //Dissolve
                let dissolved = turf.dissolve(fC)
                this.leafNodes[i].layers[j] = dissolved.features
            }
        }
    }

    performDifference(){
        this.root.difference()
    }

    dissolveNodesDifference(){
        this.difference = this.root.dissolveDifference()
    }


    ////Functions for union analysis
    //Fill tree with layers
    fillTreeUnion(layers){
        console.log("-layers", layers)
        for(let i = 0; i< layers.length; i++){
            let layer = layers[i]
            //Fill each feature in layer
            let features = layer.features
            for(let j = 0; j<features.length; j++){
                let feature = features[j]
                this.root.fillFeatureUnion(feature, i)
            }
            // index+=1
        }
    }

    splitLayersUnion(){
        this.root.splitLayersUnion()
    }

    performUnion(){
        this.root.union()
    }


}

export default TreeStructure

class Node {
    constructor(treeStructure, numChildren, depth,  minX, maxX, minY, maxY, name) {
        this.depth = depth

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

        if(treeStructure.name === "intersection"){
            this.layers = []
            this.intersections = []
        }else if(treeStructure.name === "difference"){
            this.layers = [[],[]]
            this.differences = null
        }
        else if(treeStructure.name === "union"){
            this.layers = [[],[]]
            this.union = []
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


    






    //// Perform intersection
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








    ////Functions for difference analysis
    fillFeatureDifference(feature, index){
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
                child.fillFeatureDifference(feature, index)
                return
            }
        }
        // If not inside any child node, add to this node
        this.layers[index].push(feature)
    }


    splitLayersDifference(){
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
            this.children[j].splitLayersDifference()
        }
    }

    //// Functions for difference analysis
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
            this.differences = dissolved.features
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
            // console.log("diff", diff)
            let intersection = diff.pop()
            for(let i = 0; i<diff.length;i++){
                let newIntersection = turf.intersect(intersection, diff[i])
                intersection = newIntersection
            }
            // console.log("intersection", intersection)

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





            ////Old code
            // let difference = []
            // for(let j=0; j<layers1.length; j++){
            //     let polygon2 = layers1[j]
            //     let difference = turf.difference(polygon1, polygon2)
            //     //If difference is null, there are no area in polygon1 that excluding the area of polygon 2.
            //     //Continue to next polygon1
            //     //Break this loop, and set difference to null
            //     if(difference === null){
            //         continue
            //     }
            //     //If the difference is equal to polygon1, polygon1 and polygon2 does not intersect. 
            //     //The difference is therefore all area of polygon 1. set difference to polygon1 and break loop
            //     if(turf.booleanEqual(polygon1, difference)){
            //         difference = polygon1
            //         break               
            //     }
            //     //If there are a difference, add to list of differences
            //     differences.push(difference)
            // }
            // //Find intersection between all these differences
            // //If no differences, continue to next polygon1
            // if(difference.length === 0){
            //     continue
            // }
            // //Else, find intersection between all differences
            // let intersections = difference[0]
            // for(let i = 1; i<difference.length; i++){
            //     let difference2 = difference[i]
            //     intersections = turf.intersect(intersections, difference2)
            // }
            // //Add intersection to list of differences
            // differences.push(intersections)
        }

        //differences should be x number of polygons, whom are not intersecting. 
        //Only needs to be dissolved
        // console.log("differences", differences)

        if(differences.length<1){
            // console.log("if zero difference, returning empty ")
            this.differences = null
            return
        }


        //When differences are found, these polygons should not overlap
        //Therefore, dissolve should not loose any data
        let fC = turf.featureCollection(differences)
        let dissolved = turf.dissolve(fC)
        // console.log("diss", dissolved)
        this.differences = dissolved.features
    }

    _createMultiPolygons(){
        //For each layer
        // console.log("this.layers", this.layers)
        for(let i = 0; i<this.layers.length; i++){
            let layers = this.layers[i]

            //If number of layers are 0 or 1, nothing needs to be done
            if(layers.length <=1){
                continue
            }

            //If number of layers are more than 1, create multipolygon
            let multiPolygon = turf.multiPolygon([])
            // console.log("layers", layers)
            for(let j = 0; j<layers.length; j++){
                // let coordinates = turf.coordAll(layers[j])
                // multiPolygon.geometry.coordinates.push(coordinates)
            // }
                let layer = layers[j]
                // console.log("layer", layer)
                let coordinates = layer.geometry.coordinates
                for(let c = 0; c<coordinates.length; c++){
                    let coordinate = coordinates[c]
                    // console.log("coordinate", coordinate)
                    // console.log("type", Array.isArray(coordinate[0][0]))
                    if(Array.isArray(coordinate[0][0])===false){
                        // console.log("coordinate[0][0]", coordinate)
                        multiPolygon.geometry.coordinates.push(coordinate)
                    }else if(Array.isArray(coordinate[0][0][0])===false){
                        
                        for(let i = 0; i < coordinate.length; i++){
                            // console.log("coordinate[0][0][0]", coordinate[i])
                            multiPolygon.geometry.coordinates.push(coordinate[i])
                        }
                    }

                    // if(coordinate.length === 1){
                    //     multiPolygon.geometry.coordinates.push(coordinate[0])
                    // }else{
                    //     multiPolygon.geometry.coordinates.push(coordinate)
                    // }
                }
                
            }
            // console.log("multiPolygon", multiPolygon)
            this.layers[i] = [multiPolygon]
        }
        
    }









    ////Functions for Dissolving
    dissolveDifference(){
        //If at root node
        if(this.children === null){
            if(this.differences !== null){
                return turf.featureCollection(this.differences)
            }
            return null
        }
        
        //Dissolve every children in node, and return to parent node
        let dataFromChildren = []
        for(let c = 0; c <this.children.length; c++){
            let data = this.children[c].dissolveDifference()
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
        let dissolved = turf.dissolve(combinedFeatureCollections)

        return dissolved







        // // If at root node
        // if(this.children === null){
        //     console.log("-----------------"+this.name+"-----------------")
        //     console.log("this.differences", this.differences)
        //     if(this.differences !== null){
        //         return turf.featureCollection(this.differences)
        //     }
        //     return null
        //     // return this.differences
        // }
        // //Dissolve children
        // let childrenDissolved = []
        // for(let i = 0; i < this.children.length; i++){
        //     let dissolvedChild = this.children[i].dissolveDifference()
        //     console.log("dissolvedChild", dissolvedChild)
        //     // if(dissolvedChild !== null && dissolvedChild !== undefined){
        //     if(dissolvedChild !==null){
        //         childrenDissolved.push(dissolvedChild)
        //     }
        // }
        // console.log("-----------------"+this.name+"-----------------")
        // console.log("childrenDissolved", childrenDissolved)

        // if(childrenDissolved.length <=1){
        //     console.log("null features", childrenDissolved)
        //     return null
        // }

        // if(childrenDissolved.length === 1){
        //     console.log("one feature", childrenDissolved)
        //     return childrenDissolved[0]
        // }

        // // console.log("node", this)
        // let combinedFeatureCollection = this._combineFeatureCollectionsDifference(childrenDissolved)
        // console.log("combinedFeatureCollection", combinedFeatureCollection)

        // //Dissolve featureCollection
        // //only if there are features in featureCollection (else error occurs)
        // let dissolved = []
        // if(combinedFeatureCollection.features.length !== 0){
        //     dissolved = turf.dissolve(combinedFeatureCollection)
        // }
        // // dissolved = null
        // this.dissolved = dissolved
        // // console.log("dissolved", dissolved)
        // // return dissolved
        // return dissolved
    }

    //Combines two featurecollections
    //Splits multipolygons into polygons
    _combineFeatureCollectionsDifference(featureCollections){
        // console.log("featureCollections", featureCollections)
        let newFeatureCollection = turf.featureCollection([])
        //For each featurecollection
        for(let i = 0; i < featureCollections.length; i++){
            let featureCollection = featureCollections[i]
            // console.log("-----featureCollection"+i+"-----", featureCollection)
            //For each feature in featurecollection
            for(let j = 0; j < featureCollection.features.length; j++){
                let feature = featureCollection.features[j]
                // console.log("feature", feature)
                // console.log("---feature"+j+"---", feature)
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



    ////Functions for union analysis
    fillFeatureUnion(feature, index){
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
                child.fillFeatureUnion(feature, index)
                return
            }
        }
        // If not inside any child node, add to this node
        this.layers[index].push(feature)
    
    
    }

    splitLayersUnion(){
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
            this.children[j].splitLayersUnion()
        }

    }

    union(){
        //If at leaf node, perform difference
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
            this.children[i].union()
        }
    }

    _internalUnion(){
        let layers0 = this.layers[0]
        let layers1 = this.layers[1]

        //If only the first layer has features, keep this
        if(layers0.length > 0 && layers1.length === 0){
            // console.log("Returning dissolved layer0")
            let dissolved = turf.dissolve(turf.featureCollection(layers0))
            this.differences = dissolved.features
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
                let union = turf.union(polygon0, polygon1)
                //If difference is null, continue to next polygon
                if(union === null){
                    continue
                }
                //If difference is a polygon/multipolygon, add to diff
                diff.push(union)

            }
            // Perform intersection between every differences
            //If no differences, continue to next layer
            if(diff.length === 0){
                continue
            }
            // console.log("diff", diff)
            let intersection = diff.pop()
            for(let i = 0; i<diff.length;i++){
                let newIntersection = turf.union(intersection, diff[i])
                intersection = newIntersection
            }
            // console.log("intersection", intersection)

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
        // console.log("differences", differences)

        if(differences.length<1){
            // console.log("if zero difference, returning empty ")
            this.differences = null
            return
        }


        //When differences are found, these polygons should not overlap
        //Therefore, dissolve should not loose any data
        let fC = turf.featureCollection(differences)
        let dissolved = turf.dissolve(fC)
        // console.log("diss", dissolved)
        this.differences = dissolved.features
    }



}