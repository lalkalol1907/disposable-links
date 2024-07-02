import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  REDIS_HOST: Joi.string(),
  REDIS_PORT: Joi.number().port().default(6379),
  APP_PORT: Joi.number().port().default(3000),
});
