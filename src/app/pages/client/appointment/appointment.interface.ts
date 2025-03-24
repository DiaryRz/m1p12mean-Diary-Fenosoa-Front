export interface Appointment {
    _id: String,
    date_reservation_request: Date,
    id_user: String,
    id_car: String,
    services: String,
    total_price: Number,
    total_payed: Number,
    status: String,
    date_appointment: Date,
}
