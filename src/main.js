var memoryManager = require('memoryManager')
var roleTower = require('roleTower')
var roleWorker = require('roleWorker')
var roleHarvester = require('roleHarvester')
var roleSpawner = require('roleSpawner')
var _ = require('lodash')

module.exports.loop = function () {

    // debugging

    var nearestContainer = Game.getObjectById('57ef9d9586f108ae6e60df7a').pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER;
        }
    });
    console.log(nearestContainer);

    // end

    Memory.home = 'W8N68';

    memoryManager.collect();
    memoryManager.updateStructureStore(Memory.home);
    memoryManager.updateResourceStore(Memory.home);

    roleSpawner.run();
    roleTower.run(Memory.home);

    for(var name in Game.creeps) {
	    var creep = Game.creeps[name];
	    switch (creep.memory.role) {
	        case 'worker':
	            roleWorker.run(creep);
	            break;
	        case 'harvester':
	            roleHarvester.run(creep);
	            break;
	    }
    }
}
