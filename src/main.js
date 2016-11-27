var memoryManager = require('memoryManager')
var roleTower = require('roleTower')
var roleWorker = require('roleWorker')
var roleHarvester = require('roleHarvester')
var roleSpawner = require('roleSpawner')
var roleGeneralist = require('roleGeneralist')
var oldGc = require('garbageCollector')
var _ = require('lodash')

module.exports.loop = function () {

    Memory.home = 'W8N68';

    memoryManager.collect();
    memoryManager.updateStructureStore(Memory.home);
    memoryManager.updateResourceStore(Memory.home);

    oldGc.collect();

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
	        case 'generalist':
	            roleGeneralist.run(creep);
	            break;
	    }
    }
}
