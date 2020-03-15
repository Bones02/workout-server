const express = require( 'express' )
const path = require( 'path' )
const TypeService = require( './type-service' )
const logger = require( '../logger' )

const typeRouter = express.Router()
const jsonParser = express.json()

// pull each piece of logic out of each route, all after .get, and put that all into a route file with a function for each route.
typeRouter
  .route( '/' )
  .get( ( req, res, next ) => {
    console.log("test", req.originalUrl)
    const knexInstance = req.app.get( 'db' )
    TypeService.getAllTypes( knexInstance )
      .then( ( types ) => {
        res.json( types )
      } )
      .catch( next )
  } )
  .post( jsonParser, ( req, res, next ) => {
    const { name : newTypeName } = req.body
    // build a validator / sanitizer middlewear for this.
    TypeService.insertType(
      req.app.get( 'db' ),
      newTypeName
    )
      .then( ( folder ) => {
        res
          .status( 201 )
          .location( path.posix.join( req.originalUrl, `/${type.id}` ) )
          .json( type )
      } )
      .catch( next )
  } )

typeRouter

  .route( '/:typeId' )
  .all( ( req, res, next ) => {
    TypeService.getTypeById(
      req.app.get( 'db' ),
      req.params.folderId
    )
      .then( ( type ) => {
        if ( !type ) {
          logger.error( `Type with id ${req.params.typeId} not found` )
          return res.status( 404 ).json( {
            error : { message : 'Type not found.' }
          } )
        }
        res.type = type // save folder for next middlewear, and pass on to next
        next()
      } )
      .catch( next )
  } )
  .get( ( req, res, next ) => {
    // res.json( res.folder )

    TypeService.getWorkoutsForType(
      req.app.get( 'db' ), 
      res.type.id
    )
      .then( ( workouts ) => {
        if ( !workouts ) {
          return res.status( 404 ).json( {
            error : { message : 'Cannot find any workouts for that type' }
          } )
        }
        const type = res.type
        res.json( { type, workouts } )
        next()
      } )
  } )
  .patch( jsonParser, ( req, res, next ) => {
    const { name : newTypeName } = req.body
   
    TypeService.updateTypeName(
      req.app.get( 'db' ),
      req.params.typeId,
      newTypeName
    )
      .then( ( updatedType ) => {
        res
          .status( 200 )
          .json( updatedType )

      } )
      .catch( next )
  } )  
  .delete( ( req, res, next ) => {
    TypeService.deleteType(
      req.app.get( 'db' ),
      req.params.typeId
    )
      .then( ( numRowsAffected ) => {
        res
          .status( 204 )
          .end()
      } )
      .catch( next )
  } ) 

module.exports = typeRouter