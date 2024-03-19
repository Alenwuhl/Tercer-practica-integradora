export default class UsersDto {
    constructor(user) {
        if (!user) throw new Error("User data is required");
        this.fullName = user.name;
        this.email = user.email;
        this.age = user.age;
    }
};