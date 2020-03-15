const express = require( 'express' )
const path = require( 'path' )
const WorkoutService = require( './workout-service' )

const workoutRouter = express.Router()
const jsonParser = express.json()

// pull each piece of logic out of each route, all after .get, and put that all into a route file with a function for each route.
workoutRouter

  .route( '/' )

  .get( ( req, res, next ) => {
    const knexInstance = req.app.get( 'db' )
    WorkoutService.getAllWorkouts( knexInstance )
      .then( ( workouts ) => {
        res
          .status( 200 )
          .json( workouts )
      } )
      .catch( next )
  } )

  .post( jsonParser, ( req, res, next ) => {
    const { name, typeid, description, calories, minutes } = req.body
    if ( !( name && typeid ) ) {
      return res.status( 400 ).json( {
        error : { message : `${name}, ${typeid}` }
      } )
    }

    const newWorkout = {
      name, 
      typeid,
      description,
      calories,
      minutes
    }
    
    WorkoutService.insertWorkout(
      req.app.get( 'db' ),
      newWorkout
    )
      .then( ( workout ) => {
        res
          .status( 201 )
          .location( path.posix.join( req.originalUrl, `/${workout.id}` ) )
          .json( workout )
      } )
      .catch( next )
  } )


workoutRouter

  .route( '/:workoutId' )
  .all( ( req, res, next ) => {
    WorkoutService.getWorkoutById(
      req.app.get( 'db' ),
      req.params.workoutId
    )
      .then( ( workout ) => {
        if ( !workout ) {
          return res.status( 404 ).json( {
            error : { message : 'Note not found.' }
          } )
        }
        res.workout = workout // save note for next middlewear, and pass on to next
        next()
      } )
      .catch( next )
  } )
  .get( ( req, res, next ) => {
    res.json( res.workout )
  } )
  .patch( jsonParser, ( req, res, next ) => {
    const { name, typeId, description, calories, minutes } = req.body
    const workoutToUpdate = { name, typeId, description, calories, minutes }
    const numberOfUpdatedFields = Object.values( workoutToUpdate ).filter( Boolean ).length
    if ( numberOfUpdatedFields === 0 ) {
      return res.status( 400 ).json( {
        error : {
          message : 'Request body must contain at least one field to update'
        }
      } )
    }
    const modified = new Date()
    const newWorkoutFields = {
      ...workoutToUpdate, 
      modified
    }
    // ISSUE: You can't reassociate a note to a new folder, probably because of the constraints of the field.
    WorkoutService.updateNote(
      req.app.get( 'db' ),
      res.workout.id,
      newWorkoutFields
    )
      .then( ( updatedWorkout ) => {
        res
          .status( 200 )
          .json( updatedWorkout[0] )
      } )
      .catch( next )
  } )
  .delete( ( req, res, next ) => {
    WorkoutService.deleteWorkout(
      req.app.get( 'db' ),
      req.params.workoutId
    )
      .then( ( numRowsAffected ) => {
        res
          .status( 204 )
          .end()
      } )
      .catch( next )
  } )
    
module.exports = workoutRouter