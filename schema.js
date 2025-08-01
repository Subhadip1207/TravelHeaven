const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),    // Title must be string type and required.
        description : Joi.string().required(),
        price : Joi.number().required().min(0), // lowest value of the price is 0 i.e. price can not be negative. 
        location : Joi.string().required(),
        country : Joi.string().required(),
       image: Joi.object({
        url: Joi.string().allow("",null).default("https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9vYX")
       }),
       category: Joi.string().required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
})