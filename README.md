# The Block Experience
Bitcoin block explorer developed using the Meteor framework.

Currently under development.

### Deployment instructions
You need to have access to a full bitcoin node.
Set the properties in the settings.json file like tyis:


{
  "public": {
},
  "bitcoinNode": {
    "host": "<your-full-node-hostname>",
    "port": your-full-node-rpc-Port,
    "user": "your-full-node-rpc-user",
    "pass": "your-full-node-rpc-password",
    "timeout": 3000
  }
}

You can run the application with
meteor run --settings settings.json

### Notes
Initial indexing of blocks can take several hours.
