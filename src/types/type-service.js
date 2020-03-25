const TypeService = {
    getAllTypes( knex ) {
      return knex
        .select( '*' )
        .from( 'types' )
    },
    insertType( knex, newTypeName ) {
      return knex
        .insert( { name : newTypeName } )
        .into( 'types' )
        .returning( '*' )
        .then( ( rows ) => {
          return rows[0]
        } )
    },
    getTypesById( knex, id ) {
      return knex
        .select( '*' )
        .from( 'types' )
        .where( { id } )
        .first()
    },
    getWorkoutsForTypes( knex, typeid ) {s
      const workouts = knex
        .select( '*' )
        .from( 'workouts' )
        .where( { typeid } )
      return workouts
    },
    deleteType( knex, id ) {
      return knex( 'types' )
        .where( { id } )
        .delete()
    },
    updateTypeName( knex, id, name ) {
      return knex( 'types' )
        .where( { id } )
        .update( { name } )
        .returning( '*' )
        .then( ( rows ) => {
          return rows[0]
        } )
    },
  }
    
  module.exports = TypeService