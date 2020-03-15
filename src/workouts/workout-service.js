const WorkoutService = {
    getAllWorkouts( knex ) {
      return knex
        .select( '*' )
        .from( 'workouts' )
    },
    insertWorkout( knex, newWorkout ) {
      return knex
        .insert( { ...newWorkout } )
        .into( 'workouts' )
        .returning( '*' )
        .then( ( rows ) => {
          return rows[0]
        } )
    },
    getWorkoutsById( knex, id ) {
      return knex
        .select( '*' )
        .from( 'workouts' )
        .where( 'id', id )
        .first()
    },
    deleteWorkout( knex, id ) {
      return knex( 'workouts' )
        .where( { id } )
        .delete()
    },
    updateWorkout( knex, id, newWorkoutFields ) {
      return knex( 'workouts' )
        .where( { id } )
        .update( { ...newWorkoutFields }, '*' )
    },
  }
      
  module.exports = WorkoutService