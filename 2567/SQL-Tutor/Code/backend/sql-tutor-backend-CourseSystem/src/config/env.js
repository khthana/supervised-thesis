const envalid = require("envalid");
require("dotenv").config();

const env = envalid.cleanEnv(process.env, {
  HOST: envalid.str({ devDefault: "0.0.0.0" }),
  PORT: envalid.num({ devDefault: 5000 }),
  NODE_ENV: envalid.str({
    devDefault: "development",
    choices: ["development", "production"],
  }),
    // Main Database Variables
    DB_NAME: envalid.str(),
    DB_USER: envalid.str(),
    DB_PASS: envalid.str(),
    DB_HOST: envalid.str(),
    DB_PORT: envalid.num(),

    // Execute Database Variables
    EXECUTE_DB_NAME: envalid.str(),
    EXECUTE_DB_USER: envalid.str(),
    EXECUTE_DB_PASS: envalid.str(),
    EXECUTE_DB_HOST: envalid.str(),
    EXECUTE_DB_PORT: envalid.num(),
});

module.exports = {
  env,
};
