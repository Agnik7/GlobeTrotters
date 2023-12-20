import os
from datetime import datetime
import uuid
from pymongo import MongoClient
import bcrypt
CONNECTION = os.environ.get("MONGO_URI")
CLIENT = MongoClient(CONNECTION)
if CLIENT:
    print("=========Connection Successfull=============")
else:
    print("==========Connection Failed==========")

USER_DATABASE = CLIENT.get_database("globetrotters")
USER_DETAILS = USER_DATABASE['user_database']

FLIGHT_DB = CLIENT.get_database("flights_db")

HOTEL_DB = CLIENT.get_database("hotels_db")

class Database:
    
    def __init__(self):
        self.name = ''
    def register(self,name, email, password):
        existing_user = USER_DETAILS.find_one({"email": email})
        if existing_user:
            print("xxxxxxxxxxxxxxxxxxxxxxxxxxx Error: User already exists in the database.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            return False
        user_id = int(uuid.uuid4().int & (1 << 31)-1)
        user = {
                '_id': str(user_id),
                'name': name,
                'email': email,
                'password': password
            }
        response=USER_DETAILS.insert_one(user)
        if response.inserted_id:
            return True
        else:    
            return False

    def login(self,email,password):
        user = USER_DETAILS.find_one({"email": email})
        if user:
            user_password = user["password"]
            self.name = user['name']
            if bcrypt.checkpw(password.encode('utf-8'), user_password.encode('utf-8')):
                return True
            else:
                print("xxxxxxxxxxxxxxxxxxxxxxxxxx Error: Password did not match xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                return False
        else:
            print("xxxxxxxxxxxxxxxxxxxxxxxxxx Error: No such user xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            return False
    
    def user_id(self,email):
        user = USER_DETAILS.find_one({'email':email})
        return user["_id"]
    def user_name(self):
        return self.name
    
    def reset_password(self, email, new_password):
        user_details = USER_DETAILS.find_one({'email':email})
        if not user_details:
            print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Error: User does not exist xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            return False
        user = {
            '_id': user_details['_id'],
            'name': user_details['name'],
            'email': user_details['email'],
            'password': new_password
        }
        update = USER_DETAILS.update_one({'email': email}, {'$set': user})
        if update:
            print("========================Password Changed Successfully================================")
            return True
        else:
            print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx Error occurred while changing the password xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
            return False
    
    def get_flights(self, from_dest, to_dest, cabin_class, trip_type, departure, seats):
        flight_names = []
        flight_number=[]
        available_seats = []
        departure_times = []
        arrival_times = []
        date=[]
        price=[]
        trip=[]
        cabin=[]
        for collection_name in ['BreezeAir', 'FlyJet', 'StarGlide']:
            collection = FLIGHT_DB.get_collection(collection_name)
            query = {
                'from': from_dest,
                'to': to_dest,
                'trip_type':trip_type,
                'cabin_class':cabin_class,
                'date': {'$gte': departure}
            }
            cursor = collection.find(query)
            for flight in cursor:
                flight_names.append(collection_name)
                flight_number.append(flight['_id'])
                available_seats.append(flight['seats_available'])
                departure_times.append(flight['departure_time'])
                arrival_times.append(flight['arrival_time'])
                date.append(flight['date'])
                price.append(flight['price'])
                trip.append(flight['trip_type'])
                cabin.append(flight['cabin_class'])
        l = [flight_names,flight_number, available_seats, departure_times, arrival_times,date,price,trip,cabin]

        return l
    
    def book_flight_ticket(self, id, name, people):
        collection = FLIGHT_DB.get_collection(name)
        query = {
            '_id': id,
        }
        update_data = {
            '$set': {
                'seats_available': str(people)
            }
        }
        update_result = collection.update_one(query, update_data)
        if update_result.modified_count == 1:
            return True
        else:
            return False

    def get_hotels(self, check_in, check_out, location, room_type, people_num, room_num):    
        hotel_id = []
        hotel_names = []
        available_rooms = []
        room_types = []
        price = []
        collection = HOTEL_DB[location]
        query = {
            'check_in': check_in,
            'check_out': check_out,
            'room_type': room_type, # Date should be on or after 'departure'
        }
        cursor = collection.find(query)
        for hotel in cursor:
            hotel_id.append(hotel['_id'])
            hotel_names.append(hotel['hotel_name'])
            available_rooms.append(hotel['rooms_available'])
            room_types.append(hotel['room_type'])
            price.append(hotel['price'])
        l = [hotel_names,hotel_id, available_rooms, room_types, price]
        return l
    def book_hotel_room(self, id,rooms, location):
        collection = HOTEL_DB.get_collection(location)
        query = {
            '_id': id,
        }
        update_data = {
            '$set': {
                'rooms_available': str(rooms)
            }
        }
        update_result = collection.update_one(query, update_data)
        if update_result.modified_count == 1:
            return True
        else:
            return False
        