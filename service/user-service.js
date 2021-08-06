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
        return this.generateToken(user)
    }

    async login(email,password){
        const user = await UserModel.findOne({email})
        if(!user){
            throw ApiError.BadRequest('User dont found!')
        }
        const isPassEquals = await bcrypt.compare(password,user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest('Password incorrect!')
        }

        return this.generateToken(user)

    }


    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        return this.generateToken(user)

    }

    async generateToken(user){
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken)

        return {
            ...tokens,
            user:userDto
        }
    }

    async getAllUsers(){
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();