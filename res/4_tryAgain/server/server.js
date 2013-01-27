const PORT = 1337;
var sio = require('socket.io').listen( PORT );

runningJobs = [];

function sendOrder(socket)
{
    console.log('Sending client an order for ' + formerLow + ' / ' + formerHigh);
    socket.emit('order', {low: formerLow, high: formerHigh});
    formerLow = formerHigh;
    formerHigh += RANGE_COMPUTE;
}

 /**
  * Asynchronously fetches the chunks of data from the master.
  * @param socket - Socket to the master.
  * @param chunkId - Id of the next chunk.
  */
function fetchDataByChunks(/* Socket */ socket, /* int */ chunkId) {
	socket.emit('chunk', chunkId, function (chunk) {
		if (chunk != null) {
			runningJobs[data.index].dataChunks[chunkId] = chunk;
			fetchDataByChunks(socket, ++chunkId)
		});
}

sio.sockets.on('connection', function(socket) {
    console.log('New client');
    // workers.push( socket ); // TODO add to workers list with id?

	socket.on('job'), function (data) {
		// Creating the job server-side:
		runningJobs[data.index] = new Job( data.work, data.index, socket );
		
		// Creating a room for the master and its workers:
		socket.join(runningJobs[data.index].roomName);
		
		// Starting to asynchronously fetch the chunks of data from the master:
		fetchDataByChunks(socket, 0);
		
    });

    socket.on('disconnect', function() {
        console.log('Client disconnected.');
        // TODO remove from clients list
    });

});