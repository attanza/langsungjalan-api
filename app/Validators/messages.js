const messages = {
  required: "{{ field }} diperlukan",
  required_if: "{{ field }} diperlukan",
  max: "{{ field }} tidak boleh lebih dari {{ argument.0 }} karakter",
  min: "{{ field }} tidak boleh kurang dari {{ argument.0 }} karakter",
  unique: "{{ field }} tidak bisa digunakan",
  integer: "{{ field }} harus berupa nilai integer",
  boolean: "{{ field }} harus berupa nilai boolean",
  alpha_numeric: "{{ field }} harus berupa huruf dan angka tanpa spasi",
  string: "{{ field }} harus berupa string",
  number: "{{ field }} harus berupa number",
  format: "{{ field }} harus berupa format yang sudah ditentukan",
  email: "{{field}} harus berupa format email yang valid",
}

module.exports = messages
