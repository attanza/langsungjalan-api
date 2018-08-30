'use strict'

module.exports = (data) => {
  let output = {
    id: data.id,
    marketing_id: data.marketing_id,
    study_id: data.study_id,
    marketing_action_id: data.marketing_action_id,
    start_date: data.start_date,
    end_date: data.end_date,
    description: data.description,
    marketing: {
      id: data.marketing.id,
      name: data.marketing.name,
    },
  }

  return output
}


// {
//   "id": 2,
//   "marketing_id": 8,
//   "study_id": 1,
//   "marketing_action_id": 1,
//   "start_date": "2018-08-30 10:00:00",
//   "end_date": "2018-08-30 12:00:00",
//   "description": "",
//   "created_at": "2018-08-30 11:49:08",
//   "updated_at": "2018-08-30 11:50:26",
//   "marketing": {
//     "id": 8,
//     "name": "Alice Rodriguez",
//     "email": "su@sujej.lr",
//     "phone": "(729) 858-4011",
//     "description": null,
//     "photo": "",
//     "address": "935 Wahum Manor",
//     "is_active": 1,
//     "created_at": "2018-08-24 20:07:41",
//     "updated_at": "2018-08-30 10:17:38"
//   },
//   "study": {
//     "id": 1,
//     "university_id": 1,
//     "study_name_id": 1,
//     "address": "Jl. Dipatiukur",
//     "email": "if_unikom@unikom.com",
//     "phone": "0123456789",
//     "contact_person": "Budhi",
//     "description": null,
//     "lat": null,
//     "lng": null,
//     "created_at": "2018-08-30 10:17:04",
//     "updated_at": "2018-08-30 10:17:04",
//     "studyName": {
//       "id": 1,
//       "name": "Teknik Informatika",
//       "description": null,
//       "created_at": "2018-08-30 10:16:15",
//       "updated_at": "2018-08-30 10:16:15"
//     },
//     "university": {
//       "id": 1,
//       "name": "Unikom",
//       "address": "Jl. Dipatiukur",
//       "email": "unikom@unikom.co.id",
//       "phone": "02112345678",
//       "contact_person": "Budhi",
//       "description": null,
//       "province": "West Java",
//       "city": "Bandung",
//       "lat": null,
//       "lng": null,
//       "created_at": "2018-08-30 10:12:18",
//       "updated_at": "2018-08-30 10:12:18"
//     }
//   },
//   "action": {
//     "id": 1,
//     "name": "Campus Visit",
//     "description": null,
//     "created_at": "2018-08-30 10:11:08",
//     "updated_at": "2018-08-30 10:11:08"
//   }
// },
