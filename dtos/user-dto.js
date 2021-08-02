module.exports = class UserDto {
    id;
    email

    constructor(model) {
        this.email = model.email;
        this.id = model._id
    }
}