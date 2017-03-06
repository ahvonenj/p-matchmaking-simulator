# Matchmaking simulator

A general "Proof of Concept" online matchmaking simulator. 
The aim is to show off that it should not be so hard to make a _working_ online matchmaking system.

## Features

### General

- User controls
- Create new clients
- Remove clients from pool
- Group clients with eachother
- Ungroup clients
- Connect clients
- Disconnect clients
- Print clients

### Clienthandler

- Keeps track of all the clients being simulated
- New client generation

### Client

- Represents a generic "client"
- Can connect to servers
- Can form a group with other clients
- Can have "stats" to simulate skill based matchmaking

### Server

- Represents a generic online server
- Handles connections and disconnections from clients
- Can simulate latency
- Controls the matchmaker

### Matchmaker

- Handles the actual matchmaking logic

### Lobby

- Not implemented (6.3.2017)

## Todo

### General

- Raise "errors" on command

### Client

- Client-side connection drops
- Error handling

### Server

- Packet drop simulation
- Error codes
- "Random bullshit errors"
- Error handling

### Matchmaker

Nothing yet

### Lobby

Nothing yet

## Version images

### Version 0.1

![](https://github.com/ahvonenj/p-matchmaking-simulator/blob/master/misc/version_0_1.PNG?raw=true)
