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

testDisplayName = "test"
# testUser = User(testDisplayName)
displayNames = {testDisplayName:[]}
# displayNames = []


testChannel = "test-channel"
channels = {testChannel:[]}
# channels = ["fun","work","school"]
# channels = []


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

######messages

@socketio.on("message create")
def createMessage(data):
  app.logger.debug("yyyyyyy creating message", data)
  newMessage = Message(displayname=data.displayname, message=data.messagetext, channel=data.selectedchannel)
  displayNames[data.displayname].append(newMessage)
  channels[data.selectedchannel].append(newMessage)
  # return the the new message
  socket.emit("messages to render",list(newMessage))

@socketio.on("fetch messages per channel")
def fetchMessagesPerChannel(data):
  app.logger.debug("qqqqq fetch per channel",data)
  #return a list of message for a channel named in data
  if (channel[data]):
    socket.emit("messages to render",channel[data])
  else:
    #no messages for this channel
    socket.emit("error",{status:"Error fetching messages per channel",channel:data})

@socketio.on("delete messages per displayname")
def deleteMessagesPerDisplayName(data):
  deletedDisplayName = displayNames.pop(data)
  if deletedDisplayName is not None:
    socket.emit("remove messages for displayname",data)


