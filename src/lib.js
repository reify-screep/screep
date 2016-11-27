var _ = require('lodash')

// a place to put helper functions for manipulating the map, not deps on my code
lib = {

    containerWithEnergy: function(pos, targetEnergy) {
        var storage = pos.findClosestByPath(FIND_STRUCTURES, {
           filter: (structure) => {
               return (structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] > targetEnergy;
           }
        });
        return storage;
    },

}

module.exports = lib;
