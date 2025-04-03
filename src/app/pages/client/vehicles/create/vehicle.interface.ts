export enum EngineType {
  Diesel = 'Diesel',
  Gasoline = 'Gasoline',
  Electric = 'Electric',
  Hybrid = 'Hybrid'
};

export interface VehicleInterface {
    _id: String,
    date_creation: Date,
    category_id: String,
    immatriculation: String,
    mark: String,
    model: String,
    place_number: Number,
    engine_fuel_Type: EngineType ,
    user_id: String,
}
