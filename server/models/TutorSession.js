const mongoose = require("mongoose");


const tutorSessionSchema = new mongoose.Schema(
    {
        userId: {

            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        title: {

            type: String,
            required: true,
            trim: true,
        },


        subject: {

            type: String,
            required: true,
            trim: true,


        },


        gradeLevel: {

            type: String,
            required: true,
            trim: true,


        },


        mode: {

            type: String,
            required: true,
            enum: [


                "Explain This",
                "Practice Problems",
                "Quiz Me",
                "Simplify It",
                "Study Plan",
                "Writing Coach"


                ]
        },

        question: {


            type: String,
            required: true,
            trim: true,


        },

        aiResponse: {

            type: String,
            required: true,
        }
    },

    {

        timestamps: true,
    }

);

module.exports = mongoose.model("TutorSession", tutorSessionSchema);

