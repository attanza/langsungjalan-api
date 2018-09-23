'use strict'

const StudyProgram = use('App/Models/StudyProgram')
const moment = require('moment')
const { RedisHelper } = use('App/Helpers')

module.exports = async (request) => {
  let { page, limit, search_by, search_query, start_date, end_date, sort_by, sort_mode, university_id, study_name_id } = request.get()
  if (!page) page = 1
  if (!limit) limit = 10
  if (!sort_by) sort_by = 'created_at'
  if (!sort_mode) sort_mode = 'desc'

  if (marketing_id && start_date && end_date) {
    start_date = moment(start_date).format('YYYY-MM-DD HH:mm:ss')
    end_date = moment(end_date).format('YYYY-MM-DD HH:mm:ss')
    return await queryByMarketingAndDates(marketing_id, start_date, end_date, page, limit, sort_by, sort_mode)
  }
  if (marketing_id) {
    return await queryByMarketing(marketing_id, page, limit, sort_by, sort_mode)
  }
  if (search_by && search_by !== '' && search_query !== '') {
    return await queryBySearch(search_by, search_query, page, limit, sort_by, sort_mode)
  }
  if (start_date && end_date) {
    start_date = moment(start_date).format('YYYY-MM-DD HH:mm:ss')
    end_date = moment(end_date).format('YYYY-MM-DD HH:mm:ss')
    return await queryByDate(start_date, end_date, page, limit, sort_by, sort_mode)
  }
  return await defaultQuery(page, limit, sort_by, sort_mode)
}

async function queryBySearch(search_by, search_query, page, limit, sort_by, sort_mode) {
  let data = await Schedulle.query()
    .with('marketing')
    .with('study.studyName')
    .with('study.university')
    .with('action')
    .where(search_by, search_query)
    .orderBy(sort_by, sort_mode)
    .paginate(parseInt(page), parseInt(limit))
  return data.toJSON()

}

async function queryByDate(start_date, end_date, page, limit, sort_by, sort_mode) {
  let data = await Schedulle.query()
    .with('marketing')
    .with('study.studyName')
    .with('study.university')
    .with('action')
    .whereBetween('start_date', [start_date, end_date])
    .orderBy(sort_by, sort_mode)
    .paginate(parseInt(page), parseInt(limit))
  return data.toJSON()

}

async function queryByMarketing(marketing_id, page, limit, sort_by, sort_mode) {
  let data = await Schedulle.query()
    .with('marketing')
    .with('study.studyName')
    .with('study.university')
    .with('action')
    .where('marketing_id', parseInt(marketing_id))
    .orderBy(sort_by, sort_mode)
    .paginate(parseInt(page), parseInt(limit))
  return data.toJSON()

}

async function queryByMarketingAndDates(marketing_id, start_date, end_date, page, limit, sort_by, sort_mode) {
  let data = await Schedulle.query()
    .with('marketing')
    .with('study.studyName')
    .with('study.university')
    .with('action')
    .where('marketing_id', parseInt(marketing_id))
    .whereBetween('start_date', [start_date, end_date])
    .orderBy(sort_by, sort_mode)
    .paginate(parseInt(page), parseInt(limit))
  return data.toJSON()

}

async function defaultQuery(page, limit, sort_by, sort_mode) {
  let redisKey = `Schedulle_${page}_${limit}`
  let chached = await RedisHelper.get(redisKey)
  if (chached) {
    return chached
  }
  let data = await Schedulle.query()
    .with('marketing')
    .with('study.studyName')
    .with('study.university')
    .with('action')
    .orderBy(sort_by, sort_mode)
    .paginate(parseInt(page), parseInt(limit))
  await RedisHelper.set(redisKey, data.toJSON())
  return data.toJSON()
}
