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
    role_id: faker.integer({ min: 1, max: 5 })
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
    study_name_id: faker.integer({ min: 1, max: 5 }),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    contact_person: faker.name(),
    description: faker.sentence(),
    // year: faker.year({min: 2016, max: 2020}),
    // class_per_year: faker.integer({ min: 25, max: 40 }),
    // students_per_class: faker.integer({ min: 40, max: 50 }),
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

Factory.blueprint('App/Models/Product', (faker) => {
  return {
    code: faker.bb_pin(),
    name: faker.sentence({ words: 3 }),
    measurement: faker.sentence({ words: 1 }),
    price: faker.integer({ min: 100000, max: 300000 }),
    description: faker.sentence({ words: 4 }),
  }
})

Factory.blueprint('App/Models/StudyName', (faker) => {
  return {
    name: faker.sentence({ words: 3 }),
    description: faker.sentence({ words: 4 }),
  }
})

Factory.blueprint('App/Models/StudyYear', (faker) => {
  return {
    study_program_id: faker.integer({ min: 1, max: 5 }),
    year: faker.integer({ min: 2015, max: 2020 }).toString(),
    class_per_year: faker.integer({ min: 8, max: 12 }),
    students_per_class: faker.integer({ min: 25, max: 40 }),
  }
})
