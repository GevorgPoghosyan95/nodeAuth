const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dto')
const ApiError =require('../exceptions/api-error')

class UserService {
    async registration(email,password){
        const candidate = await UserModel.findOne({email})
        if(candidate){
            throw ApiError.BadRequest('Current user already exist!')
        }

        const hashPassword = await bcrypt.hash(password,3)
        const user =  await UserModel.create({email,password:hashPassword})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }
    }
}

module.exports = new UserService();