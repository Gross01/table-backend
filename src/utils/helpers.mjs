import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = (passoword) => {
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(passoword, salt)
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed)
}