const messages = {
  required: '{{ field }} is required',
  max: '{{ field }} cannot more than {{ argument.0 }} characters',
  min: '{{ field }} cannot less than {{ argument.0 }} characters',
  unique: '{{ field }} is existed',
  integer: '{{ field }} should be integer value',
  boolean: '{{ field }} should be boolean value',
  alpha_numeric: '{{ field }} can only letters and numbers with no space'
}

module.exports = messages
