const { Sequelize } = require("sequelize");
const { env } = require("../config/env");


const mainDb = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        authPlugins: { caching_sha2_password: () => () => Buffer.from(env.DB_PASS + '\0') }
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// การเชื่อมต่อกับ Execute Database
const executeDb = new Sequelize(env.EXECUTE_DB_NAME, env.EXECUTE_DB_USER, env.EXECUTE_DB_PASS, {
    host: env.EXECUTE_DB_HOST,
    port: env.EXECUTE_DB_PORT,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        authPlugins: { caching_sha2_password: () => () => Buffer.from(env.EXECUTE_DB_PASS + '\0') }
    },
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = { mainDb, executeDb };
