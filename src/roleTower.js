/*
 * shamelessly stolen from reify and then modified by ranamar then stolen back
 */

var structureNeedsRepairs = function(structure) {
    return (structure.hits < structure.hitsMax*0.8) && (structure.hits < 5000);
}

roleTower = {
    run: function(roomName) {
        var towers = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
                tower.attack(target);
            }
//            var repairTargets = tower.pos.findInRange(FIND_STRUCTURES, 40, { filter: structureNeedsRepairs });
//            if (repairTargets[0] != undefined) {
//                tower.repair(repairTargets[0]);
//            }
        }
    }
}

module.exports = roleTower;