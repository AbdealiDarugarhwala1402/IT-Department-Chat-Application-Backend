const achievementSchema = require("../../model/achievementSchema");
const studentSchema = require("../../model/studentSchema");

module.exports = {
    addAchievement: async (req, res) => {
        const { id } = req.params;
        const achievementData = new achievementSchema(req.body);    
        try {

            const studentData = await studentSchema.findById(id);
            if (!studentData) {
                return res.status(404).json({
                    status: false,
                    message: "Student not found."
                });
            }
            const savedData = await achievementData.save();
    
            res.status(201).json({
                status: true,
                message: "Achievement added successfully.",
                data: savedData 
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: false,
                message: "Error saving achievement data."
            });
        }
     }
    
}    