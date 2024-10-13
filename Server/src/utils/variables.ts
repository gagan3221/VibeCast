const {env} = process as {env : {[key : string] : string}};

export const Mongo_URI  = env.MONGO_URI;