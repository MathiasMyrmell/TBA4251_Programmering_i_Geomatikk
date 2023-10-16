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
    fillTree(layers) {
        //For each layer
        for(let i = 0; i < layers.length; i++) {
            //Fill polygons in layer
            let layer = layers[i]
            for(let j = 0; j < layer.features.length; j++) {
                let polygon = layer.features[j]
                this.root.fillFeature(polygon, i)
            }
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

    //Dissolve nodes from bottom of tree, and up
    dissolveNodes(){
        this.dissolved = this.root.dissolveNodes()
    }
}

export default TreeStructure
