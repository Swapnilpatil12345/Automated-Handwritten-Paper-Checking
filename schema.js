const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({

        Name: Joi.string().required(),
        StudentAnswerSheet: Joi.object({
            url: Joi.string().allow('',null),
            filename: Joi.string().allow('',null),
            context: Joi.string().allow('',null),
        }).allow(null),
        Roll_Number: Joi.string().required(),
        PRN_Number: Joi.string().required(),
        Class: Joi.string().allow('',null),
        
        Subject: Joi.string().allow('',null),
        MaxMarks: Joi.number().required().min(1),
        IdealAnswerSheet: Joi.object({
            url: Joi.string().allow('',null),
            filename: Joi.string().allow('',null),
            context: Joi.string().allow('',null),
        }).allow(null),
        Description: Joi.string().allow('',null),
        MarkingScheme: Joi.string().required(),
        SubjectTeacher: Joi.string().allow('',null),
        
        MarksObtained: Joi.string().allow('',null),

    }).required()
});