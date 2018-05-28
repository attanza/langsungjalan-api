'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: 'password',
    phone: faker.phone(),
    address: faker.address(),
    is_active: 1,
    role_id: 2
  }
})

Factory.blueprint('App/Models/University', (faker) => {
  return {
    name: faker.name(),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    contact_person: faker.name(),
    description: faker.sentence(),
    province: faker.province(),
    city: faker.city(),
    lat: faker.latitude(),
    lng: faker.longitude(),
  }
})

Factory.blueprint('App/Models/StudyProgram', (faker) => {
  return {
    university_id: faker.integer({ min: 1, max: 5 }),
    name: faker.name(),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    contact_person: faker.name(),
    description: faker.sentence(),
    year: faker.year({min: 2016, max: 2020}),
    class_per_year: faker.integer({ min: 25, max: 40 }),
    students_per_class: faker.integer({ min: 40, max: 50 }),
    lat: faker.latitude(),
    lng: faker.longitude(),
  }
})

Factory.blueprint('App/Models/Schedule', (faker) => {
  return {
    marketing_id: faker.integer({ min: 1, max: 5 }),
    study_id: faker.integer({ min: 1, max: 5 }),
    start_date: faker.date({year: 2018}),
    end_date: faker.date({year: 2018}),
    action: faker.sentence({ words: 4 }),
    description: faker.sentence({ words: 4 }),
  }
})


/*
marketing_id
action
study_id
start_date
end_date
description
*/

