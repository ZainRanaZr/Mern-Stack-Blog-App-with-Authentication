class blogDTO{
    constructor(blog){
        this._id= blog._id;
        this.author = blog.author;
        this.title = blog.title;
        this.content = blog.content;
        this.image = blog.image;
    }
}

module.exports = blogDTO;