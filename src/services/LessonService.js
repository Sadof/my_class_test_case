const { knex } = require("../utils/knex");

const lessonsRequestGetList = async function (req) {
  let query = knex
    .from("lessons")
    .leftJoin(
      knex
        .select(["lesson_id"])
        .count("visit as visitCount")
        .from("lesson_students")
        .where("visit", true)
        .groupBy("lesson_id")
        .as("lesson_students_count"),
      "lesson_students_count.lesson_id",
      "lessons.id"
    )
    .orderBy("id", "asc");

  let teachers_subquery = knex
    .from("lesson_teachers")
    .leftJoin("teachers", "teachers.id", "lesson_teachers.teacher_id")
    .groupBy("lesson_id")
    .as("lesson_teachers_array");

  query.leftJoin(
    teachers_subquery,
    "lesson_teachers_array.lesson_id",
    "lessons.id"
  );

  if (req.query.teacherIds) {
    teachers_subquery.select([
      "lesson_id",
      knex.raw("array_agg(lesson_teachers.teacher_id) as teachers_ids"),
      knex.raw(
        "array_agg(json_build_object('id', lesson_teachers.teacher_id, 'name', teachers.name)) as teachers"
      ),
    ]);

    let ids = req.query.teacherIds.split(",");

    query.where("teachers_ids", "&&", ids);
  } else {
    teachers_subquery.select([
      "lesson_id",
      knex.raw(
        "array_agg(json_build_object('id', lesson_teachers.teacher_id, 'name', teachers.name)) as teachers"
      ),
    ]);
  }

  let student_subquery = knex
    .select([
      "lesson_id",
      knex.raw(
        "array_agg(json_build_object('id', lesson_students.student_id, 'name', students.name, 'visit', lesson_students.visit)) as students"
      ),
      knex.raw("count(*) as students_count"),
    ])
    .from("lesson_students")
    .leftJoin("students", "students.id", "lesson_students.student_id")
    .groupBy("lesson_id")
    .as("lesson_students_array");

  query.leftJoin(
    student_subquery,
    "lesson_students_array.lesson_id",
    "lessons.id"
  );

  if (req.query.studentsCount) {
    let split = req.query.studentsCount.split(",");
    if (split.length == 1) {
      split[0] == 0
        ? query.where("students_count", "is", null)
        : query.where("students_count", "=", split[0]);
    } else if (split.length == 2) {
      if (split[0] == 0) {
        query.where((sub) => {
          sub
            .orWhere("students_count", "is", null)
            .orWhereBetween("students_count", [split[0], split[1]]);
        });
      } else {
        query.whereBetween("students_count", [split[0], split[1]]);
      }
    }
  }

  if (req.query.status) {
    query.where("status", req.query.status);
  }

  if (req.query.date) {
    let date_split = req.query.date.split(",");

    if (date_split.length == 1) {
      query.where("lessons.date", "=", date_split[0]);
    } else if (date_split.length == 2) {
      query.whereBetween("lessons.date", [date_split[0], date_split[1]]);
    }
  }

  let page = 1;
  let limit = 5;

  if (req.query.page) page = req.query.page;

  if (req.query.lessonsPerPage) limit = req.query.lessonsPerPage;

  query.offset(limit * (page - 1)).limit(limit);

  let data = query.select([
    "lessons.id",
    "lessons.date",
    "lessons.title",
    "lessons.status",
    knex.raw(`coalesce("visitCount", 0) as visitCount`),
    "lesson_teachers_array.teachers",
    "lesson_students_array.students",
  ]);

  return data;
};

module.exports = {
  lessonsRequestGetList,
};
