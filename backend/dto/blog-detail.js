class blogDetailDTO{
    constructor(blog){
        this._id= blog._id;
        this.title = blog.title;
        this.content = blog.content;
        this.image = blog.image;
        this.authorFirstName= blog.author.first_name;
        this.authorLastName= blog.author.last_name;
        this.authorUserName= blog.author.username;
        this.createdAt= blog.createdAt;
    }
}

module.exports = blogDetailDTO;