import os
import requests
import datetime

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

class Message:
  def __init__(self, displayname, message, channel):
    self.displayName = displayName
    self.message = message
    self.channel = channel
    self.msgDateTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# displayNames = []
testDisplayName = "test"
# testUser = User(testDisplayName)
displayNames = {testDisplayName:[]}
#channels = ["fun","work","school"]
# channels = []
testChannel = "test-channel"
channels = {testChannel:[]}


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
  channelNames = list(channels.keys())
  emit('channel list',channelNames)

@socketio.on('create channel')
def createChannel(data):
  # no error if already there just emit
  if data["newchannel"] not in channels:
    # channels.append(data["newchannel"])
    channels[data["newchannel"]] = []
  channelNames = list(channels.keys())
  emit('channel list',channelNames)

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
    debugDisplayNames = list(displayNames.keys())
  app.logger.debug("display name create end",debugDisplayNames)
  socket.emit("create display name results",resp)

# @socketio.on("submit vote")
# def vote(data):
#     selection = data["selection"]
#     votes[selection] += 1
#     emit("vote totals", votes, broadcast=True)
