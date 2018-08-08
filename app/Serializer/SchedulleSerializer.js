'use strict'

module.exports = (data) => {
  let output = {
    'id': 28,
    'marketing_id': 5,
    'marketing_action_id': 4,
    'study_id': 2,
    'start_date': '2018-04-02 00:00:00',
    'end_date': '2018-10-17 00:00:00',
    'description': 'Nuagaebu gosirusa zohiz bavutbuj.',
    'created_at': '2018-07-28 09:17:30',
    'updated_at': '2018-07-28 09:35:58',
    'marketing': {
      'id': 5,
      'name': 'Student',
      'email': 'student@langsungjalan.com',
      'phone': '123456789',
      'description': null,
      'photo': '',
      'address': null,
      'is_active': 1,
      'created_at': '2018-07-28 09:15:07',
      'updated_at': '2018-07-28 09:15:07'
    },
    'study': null,
    'action': {
      'id': 4,
      'name': 'De alufamwe rihor.',
      'description': 'Fakumu bav jeztiz hal.',
      'created_at': '2018-07-28 09:15:05',
      'updated_at': '2018-07-28 09:15:05'
    }
  }

  return data
}
