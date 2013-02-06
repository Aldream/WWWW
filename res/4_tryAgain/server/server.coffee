PORT = 1337
sio = require("socket.io").listen(PORT)

###
Asynchronously fetches the chunks of data from the master.
@param socket, Socket - Socket to the master.
@param chunkId, int - Id of the next chunk.
@param jobId, int - Id of the job.
###
fetchDataByChunks = (socket, chunkId, jobId) -> 
  socket.emit "chunk", chunkId, (chunk) ->
		if chunk?
		runningJobs[jobId].unassignedChunks[chunkId] = chunk
		fetchDataByChunks socket, ++chunkId, jobId
		else # No more chunks, we fetched'em all
		runningJobs[jobId].state += 1


sio.sockets.on "connection", (socket) ->
	  console.log "New client"
	  socket.join "waitingRoom"
	  socket.on "job", (data) -> # The node want to be master of a job:
			socket.get "currentWork", (err, workId) ->
				unless workId?
        
					# Creating the job server-side:
					runningJobs[data.index] = new Job(data.map, data.index, socket)
					
					# Creating a room for the master and its workers:
					socket.join runningJobs[data.index].roomName
					socket.leave "waitingRoom"
					
					# Defining the master-related events:
					socket.on "reduce", (x, callback) -> # The master want to get some intermediate results to reduce them:
						### @todo The reduce operation could be done by other workers instead of the master. ###
						### @todo Improve the results affectation. ###
						callback runningJobs[data.index].intermediateResults.pop()
						if runningJobs[data.index].intermediateResults.length is 0
							runningJobs[data.index].intermediateResults.updateStateReducePhase()
							
							### @todo Simplistic reasoning... Because we just gave the last intermediate results doesn't mean the job is over.
							There are many cases (we have many reducer workers; the reducer worker is not the master; etc) in which the current
							reduce operations can fail. We should cover them maybe... ###
							io.sockets.in(runningJobs[data.index].roomName).emit "over", null  if (@state is 1) and (runningJobs[data.index].unassignedChunks.length is 0) and (runningJobs[data.index].assignedChunks.length is 0)

					
					# Updating information about the node:
					socket.set "currentWork", data.index, ->
						socket.emit "ready"

					
					# Starting to asynchronously fetch the chunks of data from the master:
					fetchDataByChunks socket, 0, data.index
				else # Already working
					socket.emit "error",
						info: "Already working."



	socket.on "work", (idJob, callBackJob) -> # The node want to become worker:
		socket.get "currentWork", (err, workId) ->
			unless workId?
        
				# Updating information about the node:
				socket.set "currentWork", idJob, ->
			  
				  # Joining the workers on this job:
				  socket.join runningJobs[idJob].roomName
				  socket.leave "waitingRoom"
				  
				  # Defining the worker-related events:
				  socket.on "chunk", (x, callback) -> # The worker want a chunk of data:
						if runningJobs[idJob].unassignedChunks.length > 0 # We got unassigned chunks, so we give one to him
							chunk = runningJobs[idJob].unassignedChunks.shift()
							runningJobs[idJob].assignedChunks.push chunk
							socket.set "currentChunk", runningJobs[idJob].assignedChunks.length - 1, ->
								callback chunk


				  
						###
						@todo else... (check among the already-assigned chunks? put the worker in a waiting queue?)
						###
						socket.on "result", (result, callback) -> # The worker returns its intermediate result:
							socket.get "currentChunk", (err, chunkIndex) ->
								unless runningJobs[idJob].intermediateResults[result.key]?
									runningJobs[idJob].intermediateResults[result.key] =
										key: result.key
										values: []
								runningJobs[idJob].intermediateResults[result.key].values.push result
					  
								# The corresponding chunk has no use anymore, we delete it:
								delete runningJobs[idJob].assignedChunks[chunkIndex]

								socket.set "currentChunk", null, ->
									callback true



				  
						# We send back to the worker the map function of the job:
						callBackJob runningJobs[idJob].map ### @todo ###

			else # Already working
				callBackJob null ### @todo ###


	socket.on "disconnect", ->
		console.log "Client disconnected."
		# TODO remove from clients list
