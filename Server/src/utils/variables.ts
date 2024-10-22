const {env} = process as {env : {[key : string] : string}};

export const Mongo_URI  = env.MONGO_URI;
export const Mailtrap_user = env.MAILTRAP_USER
export const Mailtrap_password = env.MAILTRAP_PASSWORD
export const verification_email = env.VERIFICATION_EMAIL
export const reset_password_link = env.PASSWORD_RESET_LINK