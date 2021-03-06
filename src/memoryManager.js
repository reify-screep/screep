var _ = require('lodash')


// this abstracts over memory allowing storage of various data
memoryManager = {

    collect: function() {
        var deleted = [];

        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('collecting non-existing creep memory:', name);
                deleted.push(name);
            }
        }

        for(var resourceId in Memory.assignments) {
            for(i=0; i < deleted.length; i++) {
                _.pull(Memory.assignments[resourceId], deleted[i]);
            }
        }

        for(var target in Memory.claimTargets) {
            var worker = Memory.claimTargets[target].worked;
            if(!Game.creeps[worker]) {
                Memory.claimTargets[target].worked = undefined;
            }
        }

    },

    updateStructureStore: function(roomId) {

        var room = Game.rooms[roomId];
        var structures = room.find(FIND_STRUCTURES);
        var structureMap = {};

        for (var i=0; i < structures.length; i++) {
            var structureType = structures[i].structureType;
            if(structureMap[structureType] == undefined) {
                structureMap[structureType] = [];
            }
            structureMap[structureType].push(structures[i].id);
        }

        if(Memory[roomId] == undefined) {
            Memory[roomId] = {};
        }
        Memory[roomId].structures = structureMap;

    },

    updateResourceStore: function(roomId) {
        var room = Game.rooms[roomId];
        var resources = [];
        var raw = room.find(FIND_SOURCES);
        for (var i=0; i < raw.length; i++) {
            resources.push(raw[i].id);
        }
        Memory[roomId].energySources = resources;
    },

}

module.exports = memoryManager;

/*

variety of things should be stored in memory:

* all structures, so i do not need to find them
* assignments of who is responsible for what structures
* the creep memory itself

*/