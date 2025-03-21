export interface EmployeeItem{
  _id: String,
  date_registration: Date,
  name: String,
  firstname: String,
  mail: String,
  phone: String,
  birth_date: Date,
  CIN: String,
  gender: String,
  role_id: {
    _id:String;
    role_name: String;
  },
  status : Number,
}
