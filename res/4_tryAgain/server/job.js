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
* @param work - JS function. Defines the client algorithm.
* @param index - Index of the given data.
* @param master - Master node.
*/
 function Job(/* Function */ work, /* int */ index, /* Object:Node */ master) {
this.work = work;
this.index = index;
this.master = master;

this.unassignedChunks = []; // Chunks of data obtained from the master, still unassigned to a worker.
this.assignedChunks = []; // Chunks of data assigned to workers.
this.workers = {master.id: master}; // Map of the workers on this job.
this.intermediateResults = []; // Results form the map operation: < out_key, list(intermediate_value) >
}

 
/* ------------------------------------
* METHODS
* ------------------------------------
*/