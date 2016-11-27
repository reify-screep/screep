roleAllocator = {

    spawnNecessary: function() {
	    var store = {
	        'generalist': 8,
	    };

	    for(role in store) {
	        var count = store[role];
	        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
	        if(creeps.length < count) {
	            var build = roleAllocator.currentGeneralistBuild();
		        var newName = Game.spawns['Spawn1'].createCreep(build, undefined, {role: role});
		        console.log('spawning new ' + role + ': ' + newName);
	        }
	    }
    },

    currentGeneralistBuild: function() {
        var spawnRoomCapacity = Game.rooms[Memory.home].energyCapacityAvailable;
        if(spawnRoomCapacity >= 1300) {
            return [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
        } else if(spawnRoomCapacity >= 800) {
            return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
        } else if(spawnRoomCapacity >= 550) {
            return [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
        } else {
            return [WORK,CARRY,MOVE];
        }
    }
}

module.exports = roleAllocator;
