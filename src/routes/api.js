var express = require("express");
const {
    lessonsRequest,
} = require("../controllers/ApiController");

var router = express.Router();
const { query } = require('express-validator');


router.get("/lessons", 
    query("date").optional().matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$|^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]),\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/).withMessage('Неверный формат поля "дата"'),
    query("status").optional().isBoolean().withMessage('Неверный формат поля "статус"'),
    query("teacherIds").optional().matches(/^\d+(,\d+)*$/).withMessage('Неверный формат поля "id учителей"'),
    query("studentsCount").optional().matches(/^\d+$|^\d+,\d+$/).withMessage('Неверный формат поля "количество учеников"'),
    query("page").optional().isInt({min: 1}).withMessage('Неверный формат поля "№ страницы"'),
    query("lessonsPerPage").optional().isInt({min: 1}).withMessage('Неверный формат поля "количество учеников на странице"'),
    lessonsRequest
);

module.exports = router;