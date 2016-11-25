var _ = require('lodash')

garbageCollector = {

    collect: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        for(var sourceId in Memory.energySources) {
            var creeps = Memory.energySources[sourceId];
            var toDelete = [];
            for (var i=0; i < creeps.length; i++) {
                if(!Game.creeps[creeps[i]]) {
                    toDelete.push(creeps[i])
                }
            }
            for (var i=0; i < toDelete.length; i++) {
                 _.pull(creeps, toDelete[i]);
            }
        }
    }

}

module.exports = garbageCollector;
