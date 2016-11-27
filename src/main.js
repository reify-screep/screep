var memoryManager = require('memoryManager')
var roleTower = require('roleTower')
var roleWorker = require('roleWorker')
var roleHarvester = require('roleHarvester')
var roleSpawner = require('roleSpawner')
var roleReserver = require('roleReserver')
var _ = require('lodash')

module.exports.loop = function () {

    Memory.home = 'W8N68';
    Memory[Memory.home].spawns = ['Spawn1'];

    memoryManager.collect();
    memoryManager.updateStructureStore(Memory.home);
    memoryManager.updateResourceStore(Memory.home);

    // temp
    for(var name in Game.creeps) {
        Game.creeps[name].memory.home = Memory.home;
    }
    // end

    roleSpawner.run(Memory.home);
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
	        case 'reserver':
	            roleReserver.run(creep);
	            break;
	    }
    }
}
