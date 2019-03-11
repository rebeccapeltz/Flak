import os
import requests

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# class User:
#   def __init__(self, displayname):
#     self.displayname = displayname
#     self.messages = []

# displayNames = []
testDisplayName = "test"
# testUser = User(testDisplayName)
displayNames = {testDisplayName:[]}
#channels = ["fun","work","school"]
channels = []

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('register user displayname')
def registerUserDisplayName(data):
  app.logger.debug("xxxxxx in register user dsiplayname")
  # no error if already registered but don't add twice
  if data["displayname"] not in displayNames:
    app.logger.info("register user: ", data["displayname"])
    # displayNames.append(data["displayname"])
    # key is name and value is array of messages
    displayNames[data["display"]] = []
    

@socketio.on('fetch channels')
def fetchChannels():
  emit('channel list',channels)
@socketio.on('create channel')
def createChannel(data):
  # no error if already there just emit
  if data["newchannel"] not in channels:
    channels.append(data["newchannel"])
  emit('channel list',channels)

@socketio.on("display name create")
def createDisplayName(data):
  app.logger.debug("xxxxxxx  in createDisplayName")
  #check if name exists already
  if data["displayname"] in displayNames:
    message = f'Display name {data["displayname"]} already in use'
    resp = {"status":"fail","message":message}
  else:
    # displayNames.append(data["displayname"])
    displayNames[data["displayname"]] = []
    resp = {"status":"success","message":data["displayname"]}
  app.logger.debug("display name create end",displayNames.keys())
  emit("create display name results",resp)

# @socketio.on("submit vote")
# def vote(data):
#     selection = data["selection"]
#     votes[selection] += 1
#     emit("vote totals", votes, broadcast=True)
