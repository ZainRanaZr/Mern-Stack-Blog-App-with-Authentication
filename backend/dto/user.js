class userDTO{
    constructor(user){
        this._id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.username = user.username;
        this.email = user.email;
    }
}

module.exports = userDTO;