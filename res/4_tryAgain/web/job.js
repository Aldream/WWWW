 /**
 * -----------------------------------------------------------
 * JOB - JS OBJECT
 * -----------------------------------------------------------
 * Author : Benjamin (Bill) Planche - Aldream (2012)
 *          Contact - benjamin.planche@aldream.net
 * ---------------------
 * Defines the structure of the jobs the user will give.
 */
 
/* ------------------------------------
 * ATTRIBUTES
 * ------------------------------------
 */
 
 /**
  * Constructor
  * @param work - JS function in string format. Defines the client algorithm.
  * @param data - Data (or shard of data) to be processed by the job.
  * @param index - Index of the given data.
  */
 function Job( 	/* int */ index,
				/* Object D */ data,
				/* Function(C): void, contains emit(<K, I>) */ map,
				/* Function(K, List<I>): R */ reduce,
				/* Function(int, D, Function(C):void): void */ getChunk,
				/* Function(R): void */ callback) {
	this.data = data;
	this.index = index;
	this.map = map;
	this.reduce = reduce;
	this.getChunk = getChunk;
	this.callback = callback;
	this.results = null;
}

 
/* ------------------------------------
 * METHODS
 * ------------------------------------
 */
 
 Job.prototype = {

	/**
	 * Return a JSON object which contains a copy of the job for the workers.
	 * @param withData Flag to add or not the data.
	 * @return JSON object
	 */
	toJsonForWorker: function JobToJsonForWorker() {
		return {map : this.map, index : this.index};
	},

	/**
	 * Returns a split of data (type : Data) which will be assigned to a node for the Map process.
	 * @param int Chunk ID.
	 * @param callback Server callback.
	 */
	fetchChunk: function JobFetchData(/* int */ index, /* Function(C):void */ callback) {
		return this.getChunk(index, this.data, callback);
	},

	///**
	// * Process the split of data.
	// * Returns a value of type T (defined by the user).
	// */
	//map: function JobMap() {
	//	var fnWork = new Function("data", this.work); // Converting the string into function
	//	return fnWork(this.data);
	//},
	//
	///**
	// * Process the data furnished by the mappers to build a more condensate result.
	// * Returns a value of type T (defined by the user).
	// */
	//reduce: function JobReduce(/* T */ data) {
	//	return null; // TO DO
	//}
}
