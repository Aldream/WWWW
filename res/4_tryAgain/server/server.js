const PORT = 1337;
var sio = require('socket.io').listen( PORT );

runningJobs = [];

 /**
* Asynchronously fetches the chunks of data from the master.
* @param socket - Socket to the master.
* @param chunkId - Id of the next chunk.
* @param jobId - Id of the job.
*/
function fetchDataByChunks(/* Socket */ socket, /* int */ chunkId, /* int */ jobId) {
	socket.emit('chunk', chunkId, function (chunk) {
		if (chunk != null) {
			runningJobs[jobId].unassignedChunks[chunkId] = chunk;
			fetchDataByChunks(socket, ++chunkId)
		}
	});
}

sio.sockets.on('connection', function(socket) {
    console.log('New client');
	
	socket.join('waitingRoom');

	socket.on('job', function (data) { // The node want to be master of a job:
	
		socket.get('currentWork', function (err, workId) {
			if (workId == null) {
				// Creating the job server-side:
				runningJobs[data.index] = new Job( data.work, data.index, socket );

				// Creating a room for the master and its workers:
				socket.join(runningJobs[data.index].roomName);
				socket.leave('waitingRoom');
				
				// Defining the master-related events:
				socket.on('reduce', function (x, callback) { // The master want to get some intermediate results to reduce them:
				/** @todo The reduce operation could be done by other workers instead of the master. */
				/** @todo Improve the results affectation. */
					callback(runningJobs[data.index].intermediateResults.pop());
				});

				// Updating information about the node:
				socket.set('currentWork', data.index, function () {
					socket.emit('ready');
				});
				
				// Starting to asynchronously fetch the chunks of data from the master:
				fetchDataByChunks(socket, 0, data.index);
			}
			else { // Already working
				socket.emit('error', {info: 'Already working.'});
			}
		});
    });
	
	socket.on('work', function (idJob, callBackJob) { // The node want to become worker:
	
		socket.get('currentWork', function (err, workId) {
			if (workId == null) {
				// Updating information about the node:
				socket.set('currentWork', idJob, function () {
					
					// Joining the workers on this job:
					socket.join(runningJobs[idJob].roomName);
					socket.leave('waitingRoom');
					
					// Defining the worker-related events:
					socket.on('chunk', function (x, callback) { // The worker want a chunk of data:
						if (runningJobs[idJob].unassignedChunks.length > 0) { // We got unassigned chunks, so we give one to him
							var chunk = runningJobs[idJob].unassignedChunks.shift();
							socket.set('currentChunk', chunk.id, function () {
								runningJobs[idJob].assignedChunks[chunk.id] = chunk;
								callback(chunk);
							});
						}
						/** @todo else... (check among the already-assigned chunks? put the worker in a waiting queue?) */
					});
					
					socket.on('result', function (result, callback) { // The worker returns its intermediate result:
						
						socket.get('currentChunk', function (err, chunkId) {
							if (runningJobs[idJob].intermediateResults[result.key] == null) {
								runningJobs[idJob].intermediateResults[result.key] = {key: result.key, results: []};
							}
							runningJobs[idJob].intermediateResults[result.key].results.push(result)
							
							// The corresponding chunk has no use anymore, we delete it:
							runningJobs[idJob].assignedChunks[chunkId] = null;
							
							socket.set('currentChunk', null, function () {
								callback(true);
							});
						});
					});
				
					// We send back to the worker the map function of the job:
					callBackJob(runningJobs[idJob].work); /** @todo */
				});
			}
			else { // Already working
				callBackJob(null); /** @todo */
			}
		});
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        // TODO remove from clients list
    });

});
