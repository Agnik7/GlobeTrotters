import os
from flask import Flask, jsonify,request, session
from flask_cors import CORS
from flask_session import Session
from authenticate_user.auth import Authenticate
from database.database import Database
from hash_password.hash_password import Hash

database = Database()

FLASK_SECRET_KEY = os.environ.get("FLASK_SECRET_KEY")

app = Flask(__name__)
app.secret_key = FLASK_SECRET_KEY
app.config['SESSION_TYPE'] = 'filesystem'
app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True
)
Session(app)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "*",
        "allow_headers": ["Content-Type", "Authorization"],
        "methods": ["GET", "POST", "PUT", "DELETE"]
    }
})




@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    
    password = data.get('password')
    hash = Hash(password)
    if not name or not email or not password:
        return jsonify({"message": "Please provide all required fields."}), 400

    # You can add your own validation or database logic here
    hashed_password = hash.hashed_password()
    register = database.register(name, email, hashed_password)
    if register:
        return jsonify({"message": "User registered successfully."}), 200
    else:
        return jsonify({"message": "Error occurred while registering user."}), 500



@app.route('/login_user', methods=['POST'])
def login_user():
    print("============== Login ===============")
    data = request.json

    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Invalid credentials"}), 400
    login = database.login(email,password)
    if login:
        authenticate_user = Authenticate(email,password)
        id = database.user_id(email)
        user_name = database.user_name()
        session['logged_in'] = True
        session['email'] = email
        session['user_id'] = id
        token = authenticate_user.generate_token(id)
        return jsonify({"Success": "User is authenticated and logged in", "token": token, "name":user_name}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/forgot_password', methods=['POST'])
def reset():
    data = request.json
    email = data.get('email')
    new_password = data.get('new_password')
    if not email or not new_password:
        return jsonify({"message": "Please provide all required fields."}), 400
    hash = Hash(new_password)
    new_hashed_password = hash.hashed_password()
    reset_password = database.reset_password(email, new_hashed_password)
    if reset_password:
        return jsonify({"message": "Password changed successfully."}), 200
    else:
        return jsonify({"message": "Error occurred while changing password."}), 500


@app.route('/get_airline',methods=['GET'])
def get_airline():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header:
        token = auth_header.split(" ")[1]
    else:
        token = ''
    from_dest = request.args.get('from_dest')
    to_dest = request.args.get('to_dest')
    cabin_class = request.args.get('cabin_class')
    trip_type = request.args.get('trip_type')
    departure = request.args.get('departure')
    seats = request.args.get('seats')

    flight_details = database.get_flights(from_dest, to_dest, cabin_class, trip_type, departure, seats)
    print(cabin_class)
    # Check if any of the lists are empty
    if all(flight_details):
        return jsonify({
            "flightName": flight_details[0],
            "flightNumber": flight_details[1],
            "availableSeats": flight_details[2],
            "departureTime": flight_details[3],
            "arrivalTime": flight_details[4],
            "date": flight_details[5],
            "price": flight_details[6],
            "trip_type":flight_details[7],
            "cabin_class":flight_details[8]
        }), 200
    else:
        return jsonify({"message": "No flights available"}), 404
    
@app.route('/book_tickets',methods=['POST'])
def book_tickets():
    data = request.json
    id = data.get('id')
    name = data.get('name')
    people = data.get('people')
    if not name or not id or not people:
        return jsonify({"message":"Insufficient data given"}),401
    book = database.book_flight_ticket(id,name,people)
    if book:
        return jsonify({"message":"Flights booked successfully!!"}),200
    else:
        return jsonify({"message:" "Encountered unexpected error"}),500

@app.route('/get_hotel',methods=['GET'])
def get_hotels():
    auth_header = request.headers.get('Authorization')
    token = ''
    if auth_header:
        token = auth_header.split(" ")[1]
    else:
        token = ''
    check_in = request.args.get('check_in')
    check_out = request.args.get('check_out')
    location = request.args.get('location')
    room_type = request.args.get('room_type')
    people_num = request.args.get('people_num')
    room_num = request.args.get('room_num')
    room_type = room_type.upper()
    hotel_details = database.get_hotels(check_in, check_out, location, room_type, people_num, room_num)
    if all(hotel_details):
        return jsonify({
            "hotelName": hotel_details[0],
            "hotelId": hotel_details[1],
            "availableRooms": hotel_details[2],
            "roomType": hotel_details[3],
            "price": hotel_details[4]
        }), 200
    else:
        return jsonify({"message": "No Rooms available"}), 404

@app.route('/book_rooms',methods=['POST'])
def book_rooms():
    data = request.json
    id = data.get('id')
    name = data.get('name')
    rooms = data.get('rooms')
    location = data.get('location')
    if not name or not id or not rooms or not location:
        return jsonify({"message":"Insufficient data given"}),401
    book = database.book_hotel_room(id,rooms, location)
    if book:
        return jsonify({"message":"Room(s) booked successfully!!"}),200
    else:
        return jsonify({"message:" "Encountered unexpected error"}),500

if __name__ == "__main__" :
        app.run(host='localhost', port=9000, debug=True)