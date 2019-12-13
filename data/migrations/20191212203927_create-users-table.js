exports.up = function(knex) {
    return knex.schema.createTable('users', tbl =>{
        tbl.increments()
    
        tbl.string("username", 288)
        .notNullable()
        .unique()
    
        tbl.string("password", 288)
        .notNullable()
    
        tbl.string("department", 288)
        .notNullable()
        
    })
      
    };
    
    exports.down = function(knex, Promise) {
     return knex.schema.dropTableIfExist('user')
      
    };