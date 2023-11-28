class commentDTO{
    constructor(comment){
        this._id= comment._id;
        this.title = comment.title;
        this.content = comment.content;
        // this.authorFirstName= comment.author.first_name;
        // this.authorLastName= comment.author.last_name;
        this.authorUserName= comment.author.username;
        this.createdAt= comment.createdAt;
    }
}

module.exports = commentDTO;