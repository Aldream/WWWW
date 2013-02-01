 /**
* -----------------------------------------------------------
* JOB - JS OBJECT
* -----------------------------------------------------------
* Author : Benjamin (Bill) Planche - Aldream (2012)
* Contact - benjamin.planche@aldream.net
* ---------------------
* Defines the server-side structure of the job.
*/
 
/* ------------------------------------
* ATTRIBUTES
* ------------------------------------
*/
 
 /**
* Constructor
* @param map - JS function. Defines the client algorithm.
* @param index - Index of the given data.
* @param master - Master node.
*/
 function Job(/* Function */ map, /* int */ index, /* Object:Node */ master) {
this.map = map;
this.index = index;
this.roomName = 'job'+index;
this.master = master;
this.state = 0;

this.unassignedChunks = []; // Chunks of data obtained from the master, still unassigned to a maper.
this.assignedChunks = []; // Chunks of data assigned to mapers.
this.intermediateResults = []; // Results form the map operation: < out_key, list(intermediate_value) >
}

 
/* ------------------------------------
* METHODS
* ------------------------------------
*/
Job.prototype = {
// /**
//	* Sets the state flag of the job, to know if the chunks have been all fetched or still have to.
//	*/
//	updateStateChunksFetching: function() {
//		this.state ^= 1;
//	},
//	/**
//	* Sets the state flag of the job, to know if the current chunks have been all been processed (map) or still have to.
//	*/
//	updateStateMapPhase: function() {
//		this.state ^= 2;
//	},
//	/**
//	* Sets the state flag of the job, to know if the current intermediate results have been all processed (reduce) or still have to.
//	*/
//	updateStateReducePhase: function() {
//		this.state ^= 4;
//	},
//	
//	/**
//	* Returns true if the job is over (all chunks have been mapped and the intermediate results reduced)
//	*/
//	isOver() {
//		return (this.state == 7);
//	}
}
