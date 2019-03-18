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
DisplayNames = {testDisplayName:[]}
# DisplayNames = []


testChannel = "test-channel"
Channels = {testChannel:[]}
# Channels = ["fun","work","school"]
# Channels = []


@app.route("/")
def index():
    return render_template("index.html")

@socketio.on('register user displayname')
def registerUserDisplayName(data):
  displayname = data["displayname"]
  app.logger.debug(f'REGISTER USER DISPLAYNAME in register user displayname: {displayname}')
  # no error if already registered but don't add twice
  if displayname not in DisplayNames:
    app.logger.info(f'register user:  {displayname}')
    # DisplayNames.append(data["displayname"])
    # key is name and value is array of messages
    DisplayNames[displayname] = []
    

@socketio.on('fetch channels')
def fetchChannels():
  channelNames = list(Channels.keys())
  app.logger.debug(f"FETCH CHANNELS {channelNames}")
  socketio.emit('channel list',channelNames)

@socketio.on('create channel')
def createChannel(data):
  # no error if already there just emit
  channel = data['newchannel']
  app.logger.debug(f'CREATE CHANNEL: {channel}')
  app.logger.debug(f'existing Channels: {Channels.keys()}')
  if channel not in Channels:
    # Channels.append(data["newchannel"])
    Channels[channel] = []
  channelNames = list(Channels.keys())
  app.logger.debug(f'emiting channelNames: {channelNames}')
  socketio.emit('channel list', channelNames)

@socketio.on("display name create")
def createDisplayName(data):
  app.logger.debug("DISPLAY NAME CREATE in createDisplayName")
  #check if name exists already
  if data["displayname"] in DisplayNames:
    message = f'Display name {data["displayname"]} already in use'
    resp = {"status":"fail","message":message}
  else:
    # DisplayNames.append(data["displayname"])
    DisplayNames[data["displayname"]] = []
    resp = {"status":"success","message":data["displayname"]}
    debugDisplayNames = list(DisplayNames.keys())
    app.logger.debug(f'display name create end: {debugDisplayNames}')
  socketio.emit('create display name results', resp)

######messages

@socketio.on("message create")
def createMessage(data):
  newmessage = data["newmessage"]
  displayname = newmessage["displayname"]
  message = newmessage["messagetext"]
  selectedchannel = newmessage["selectedchannel"]
  app.logger.debug(f'MESSAGE GREATE creating message: {displayname}, {message}, {selectedchannel}')
  ###### calling for new message not working
  newMessage = Message(displayname, message, selectedchannel)
  DisplayNames[displayname].append(newMessage)
  Channels[selectedchannel].append(newMessage)
  # return the the new message
  messages = []
  # messages.append(newMessage.asdict())
  # return all messages
  for message in Channels[selectedchannel]:
    messages.append(message.asdict())
  app.logger.debug(f'MESSAGE CREATE message returning: {messages}')
  socketio.emit("messages to render",messages)

@socketio.on("fetch messages per channel")
def fetchMessagesPerChannel(data):
  app.logger.debug(f'FETCH MESSAGES PER CHANNEL fetch per channel: {data}')
  app.logger.debug(f'FETCH MESSAGES PER CHANNEL current Channels: {Channels.keys()}')
  #return a list of message for a channel named in data

  ########need to test if data is a key in Channels
  if (data in Channels.keys()):  
    app.logger.debug("found messages in channel")
    # convert messages in channel to dict
    messages = []
    for message in Channels[data]:
      messages.append(message.asdict())
    app.logger.debug(f'messages sending {messages}')
    socketio.emit("messages to render",messages)
  else:
    app.logger.debug("didn't find messages in channel")
    #no messages for this channel
    errorObj = {status:"Error fetching messages per channel",channel:data}
    socketio.emit("error", errorObj)

@socketio.on("clear server cache")
def clearServerCache():
  DisplayNames = {}
  Channels = {}
  app.logger.debug(f"cache cleared {DisplayNames} {Channels}" )
  socketio.emit("remove all messages")



@socketio.on("delete messages per displayname")
def deleteMessagesPerDisplayName(data):
  displayName = data["displayname"]
  app.logger.debug(f'DELETING MESSAGES PER DISAPLYNAME deleting message for {displayName}')
  #remove messages from user list
  DisplayNames[displayName] = []
  
  # remove object from Channels
  for channel in Channels.keys():
    messages = Channels[channel]
    app.logger.debug(f'delete messages in Channels  {messages}')
    for message in messages:
      if message.displayName == displayName:
        app.logger.debug(f'REMVING MESSAGE {message}')
        messages.remove(message)
  app.logger.debug("SENDING BACK messages in channel")
  socketio.emit("messages to render",messages)
  #socketio.emit("remove messages for displayname",displayName)



