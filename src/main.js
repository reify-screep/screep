var memoryManager = require('memoryManager')
var roleTower = require('roleTower')
var roleWorker = require('roleWorker')
var roleHarvester = require('roleHarvester')
var roleSpawner = require('roleSpawner')
var roleReserver = require('roleReserver')
var roleClaimer = require('roleClaimer')
var roleSettler = require('roleSettler')
var roleRoadlayer = require('roleRoadlayer')
var roleAttacker = require('roleAttacker')
var roleDistanceHarvester = require('roleDistanceHarvester')
var roleSniper = require('roleSniper')
var roleClaimEast = require('roleClaimEast')
var roleClaimSEast = require('roleClaimSEast')
var _ = require('lodash')

module.exports.loop = function () {

    Memory.home = 'W8N68';
    Memory.expansionTarget = 'W6N68';
    Memory.roadTarget = 'W7N68';
    Memory[Memory.home].spawns = ['Spawn1'];
    Memory[Memory.expansionTarget].spawns = ['spawn2'];

    if(Memory.claimTargets['W6N68']) {
        Memory.claimTargets['W6N68'] = undefined;
    }

    if(!Memory.claimTargets) {
        Memory.claimTargets = {};
    }
    if(!Memory.claimTargets['W7N69']) {
        Memory.claimTargets['W7N69'] = {};
    }
    if(!Memory.claimTargets['W7N68']) {
        Memory.claimTargets['W7N68'] = {};
    }

    memoryManager.collect();
    memoryManager.updateStructureStore(Memory.home);
    memoryManager.updateResourceStore(Memory.home);

    if(Game.rooms[Memory.expansionTarget] != undefined) {
        memoryManager.updateStructureStore(Memory.expansionTarget);
        memoryManager.updateResourceStore(Memory.expansionTarget);
    }

    roleSpawner.run(Memory.home);
    roleTower.run(Memory.home);

    roleSpawner.run(Memory.expansionTarget);
    roleTower.run(Memory.expansionTarget);

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
            case 'settler':
                roleSettler.run(creep);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
            case 'roadLayer':
                roleRoadlayer.run(creep);
                break;
            case 'attacker':
                roleAttacker.run(creep);
                break;
            case 'distanceHarvester':
                roleDistanceHarvester.run(creep);
                break;
            case 'sniper':
                roleSniper.run(creep);
                break;
            case 'claimEast':
                roleClaimEast.run(creep);
                break;
            case 'claimSEast':
                roleClaimSEast.run(creep);
                break;
	    }
    }
}
