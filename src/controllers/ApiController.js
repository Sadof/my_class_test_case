const { lessonsRequestGetList } = require("../services/LessonService");
const { validationResult } = require('express-validator');

const lessonsRequest = async function (req, res){
    
    try {
        const result = validationResult(req);

        if (!result.isEmpty()) {
          return res.status(400).json({ errors: result.array() });
        }

        let data = await lessonsRequestGetList(req);

        return res.status(200).json(data);
    } catch (error) {
        
        console.log(error);
        
        return res.status(404).json({message: "Api error"});
    }    
}

module.exports = {
    lessonsRequest
}