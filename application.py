import os
import requests
import datetime

from flask import Flask, jsonify, render_template, request,json
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

class Message:
  def __init__(self, displayname, message, channel):
    self.displayName = displayname
    self.message = message
    self.channel = channel
    self.msgDateTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

  def asdict(self):
    return {'displayName': self.displayName, 'message': self.message, 'channel': self.channel, 'msgDateTime':self.msgDateTime}

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
  displayname = data["displayname"]
  app.logger.debug(f'xxxxxx in register user displayname: {displayname}')
  # no error if already registered but don't add twice
  if displayname not in displayNames:
    app.logger.info(f'register user:  {displayname}')
    # displayNames.append(data["displayname"])
    # key is name and value is array of messages
    displayNames[displayname] = []
    

@socketio.on('fetch channels')
def fetchChannels():
  channelNames = list(channels.keys())
  socketio.emit('channel list',channelNames)

@socketio.on('create channel')
def createChannel(data):
  # no error if already there just emit
  channel = data['newchannel']
  app.logger.debug(f'creating channel: {channel}')
  app.logger.debug(f'existing channels: {channels.keys()}')
  if channel not in channels:
    # channels.append(data["newchannel"])
    channels[channel] = []
  channelNames = list(channels.keys())
  app.logger.debug(f'emiting channelNames: {channelNames}')
  socketio.emit('channel list', channelNames)

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
    app.logger.debug(f'display name create end: {debugDisplayNames}')
  socketio.emit(f'create display name results: {resp}')

######messages

@socketio.on("message create")
def createMessage(data):
  newmessage = data["newmessage"]
  displayname = newmessage["displayname"]
  message = newmessage["messagetext"]
  selectedchannel = newmessage["selectedchannel"]
  app.logger.debug(f'yyyyyyy creating message: {displayname}, {message}, {selectedchannel}')
  ###### calling for new message not working
  newMessage = Message(displayname, message, selectedchannel)
  displayNames[displayname].append(newMessage)
  channels[selectedchannel].append(newMessage)
  # return the the new message
  messages = []
  # messages.append(newMessage.asdict())
  # return all messages
  for message in channels[selectedchannel]:
    messages.append(message.asdict())
  app.logger.debug(f'mmmmmm message returning: {messages}')
  socketio.emit("messages to render",messages)

@socketio.on("fetch messages per channel")
def fetchMessagesPerChannel(data):
  app.logger.debug(f'qqqqq fetch per channel: {data}')
  app.logger.debug(f'rrrrr current channels: {channels.keys()}')
  #return a list of message for a channel named in data

  ########need to test if data is a key in channels
  if (data in channels.keys()):  
    # convert messages in channel to dict
    messages = []
    for message in channels[data]:
      messages.append(message.asdict())
    socketio.emit("messages to render",messages)
  else:
    #no messages for this channel
    errorObj = {status:"Error fetching messages per channel",channel:data}
    socketio.emit("error", errorObj)

@socketio.on("delete messages per displayname")
def deleteMessagesPerDisplayName(data):
  deletedDisplayName = displayNames.pop(data)
  if deletedDisplayName is not None:
    socketio.emit("remove messages for displayname",data)


