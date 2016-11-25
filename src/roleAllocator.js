roleAllocator = {

    spawnNecessary: function() {
	    var store = {
	        'generalist': 4,
	    };

	    for(role in store) {
	        var count = store[role];
	        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
	        if(creeps.length < count) {
		        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role});
		        console.log('spawning new ' + role + ': ' + newName);
	        }
	    }
    }
}

module.exports = roleAllocator;
