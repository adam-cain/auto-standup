"use server"
import bcrypt from "bcrypt"

export const saltAndHashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

export const verifyPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash)
}