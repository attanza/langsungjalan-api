'use strict'

const Factory = use('Factory')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    name: faker.name(),
    email: faker.email(),
    password: 'password',
    phone: faker.phone(),
    address: faker.address(),
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
    university_id: faker.integer({ min: 1, max: 3 }),
    study_name_id: faker.integer({ min: 1, max: 3 }),
    email: faker.email(),
    phone: faker.phone(),
    address: faker.address(),
    contact_person: faker.name(),
    description: faker.sentence(),
    lat: faker.latitude(),
    lng: faker.longitude(),
  }
})

Factory.blueprint('App/Models/Schedulle', (faker) => {
  return {
    marketing_id: faker.integer({ min: 1, max: 3 }),
    study_id: faker.integer({ min: 1, max: 3 }),
    marketing_action_id: faker.integer({ min: 1, max: 3 }),
    start_date: faker.date({year: 2018}),
    end_date: faker.date({year: 2018}),
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
    study_program_id: faker.integer({ min: 1, max: 3 }),
    year: faker.integer({ min: 2015, max: 2020 }).toString(),
    class_per_year: faker.integer({ min: 8, max: 12 }),
    students_per_class: faker.integer({ min: 25, max: 40 }),
  }
})

Factory.blueprint('App/Models/MarketingAction', (faker) => {
  return {
    name: faker.sentence({ words: 3 }),
    description: faker.sentence({ words: 4 }),
  }
})

Factory.blueprint('App/Models/MarketingReport', (faker) => {
  return {
    marketing_id: faker.integer({ min: 1, max: 3 }),
    schedulle_id: faker.integer({ min: 1, max: 3 }),
    marketing_action_id: faker.integer({ min: 1, max: 3 }),
    method: 'By Meeting',
    contact_person: faker.name(),
    contact_person_phone: faker.phone(),
    count_year: faker.integer({ min: 2015, max: 2020 }).toString(),
    count_class: faker.integer({ min: 5, max: 8 }),
    average_students: faker.integer({ min: 20, max: 30 }),
    count_attendances: faker.integer({ min: 15, max: 25}),
    count_student_dps: faker.integer({ min: 15, max: 20}),
    count_shared_packages: faker.integer({ min: 20, max: 30}),
    count_orders: faker.integer({ min: 10, max: 15}),
    count_cancel_order: faker.integer({ min: 1, max: 5}),
    count_dps: faker.integer({ min: 10, max: 15}),
    schedulle_date: faker.date({year: 2018}),
    terms: faker.sentence({ words: 4 }),
    result: faker.sentence({ words: 2 }),
    lat: faker.latitude(),
    lng: faker.longitude(),
    description: faker.sentence({ words: 4 }),
  }
})
