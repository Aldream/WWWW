/**
 * -----------------------------------------------------------
 * WORKER - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Define a worker, a client node associated with a job to help execute it.
 */
 
/* ------------------------------------
* ATTRIBUTES
* ------------------------------------
*/

/**
* Constructor
* @param id - ID given to this worker.
* @param idJob - ID of the job this node will work on.
* @param socket - Socket to communicate with the server.
*/
function Worker(/* int */ id, /* int */ idJob, /* Socket */ socket) {
	this.id = id;
	this.mapFunction = null;
	this.socket = socket;

	//this.dataChunk = {}; // Chunk of data the worker is currently dealing with.
	//this.results = {};
	
	// Defining how to handle some socket events:
	/** @todo */
	this.socket.on('connect', function () { 
		// "connect" is emitted when the socket connected successfully
		
	});
	this.socket.on('connecting', function () {
		// "connecting" is emitted when the socket is attempting to connect with the server.
		
	});
	this.socket.on('disconnect', function () {
		// "disconnect" is emitted when the socket disconnected
		
	});
	this.socket.on('connect_failed', function () {
		// "connect_failed" is emitted when socket.io fails to establish a connection to the server and has no more transports to fallback to.
		
	});
	this.socket.on('error', function () {
		// "error" is emitted when an error occurs and it cannot be handled by the other event types.
		
	});
	this.socket.on('message', function (message, callback) {
		// "message" is emitted when a message sent with socket.send is received. message is the sent message, and callback is an optional acknowledgement function.
		
	});
	this.socket.on('reconnect_failed', function () {
		// "reconnect_failed" is emitted when socket.io fails to re-establish a working connection after the connection was dropped.
		
	});
	this.socket.on('reconnect', function () {
		// "reconnect" is emitted when socket.io successfully reconnected to the server.
		
	});
	this.socket.on('reconnecting', function () {})
		
	});
	
	// Subscribing as a worker to the server:
	this.socket.emit('work', idJob, function(mapFunction) {
		if (mapFunction != null) { // We got the job
			this.mapFunction = mapFunction;
			
			// So we start working...
			this.work();
		}
		/** @todo else ... */
	});
}


/* ------------------------------------
 * METHODS
 * ------------------------------------
 */
Worker.prototype = {
	
	/** Communications Methods **/
	
	/**
	* Fetches chunks of data, processes them, and sends back the intermediate results, over and over.
	*/
	work: function WorkerWork() {
		// We fetch a chunk:
		this.socket.emit('chunk', null, function (chunk) {
			/** @todo Deal with the "no-more-" or "not-yet-" chunks cases ... */
			/** @todo Deal with the map function aynchronously (using webworkers)? */
			// We process it:
			this.mapFunction(chunk);
			// We start again:
			this.work();
		});
	},
	
	/**
	* Sends an intermediate result to the server.
	* Should be used inside the Map function.
	* @param intermediateResult - Result to be sent.
	*/
	emit: function WorkerEmit(/* Object */ intermediateResult) {
		var worker = this;
		this.socket.emit('result', intermediateResult, function (isAcknowledged) {
			if (!isAcknowledged) {
				worker.emit(intermediateResult);
			}
		});
	}
}
