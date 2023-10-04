## Execution Prerequisites

- Access Requirements.
- `StationWatcher` version 3.3.8
- `TestStation2` version 2.3.7
- You have to have the address of the Test Plan Editor Web Service.

## MES Registry Setup

### Common Key/Values

These are found:

```
  GTM/Software/<ApplicationName>/<PropertyName>/<Variant>
```

The following pieces of the path are as follows:

- Application Name: The name of your application that is accessing the Registry.
  (examples: StationWatcher, TestStation2)
- Property Name : The name of a property you want to specialize from within the application (examples: wsHost, wsDebug).
- Variant : The variant is used to identify which common value you want to use. (examples: PROD, ENG).

Common places for values will help when we want to move where endpoints for our web services are hosted. Each C++ Native Application (StationWatcher/TestStation2) contain a custom path to the WebSocketHost (wsHost). See the next sections for details. Users can instead opt to use a common value for wsHost- for example if the following StationWatcher key is set:

```
      - GTM/Manufacturing/Assets/C-6988:wsHost = ${JR}
```

It looks for the value at:

```
  - GTM/Software/StationWatcher/wsHost/JR
```

Which is set to my development machine. When the details on this are finalized we can point at ${PROD} or ${ENG} instead. This allows us to change where the C++ apps are getting their endpoints in one change to MES instead of changing each app individually.

### Station Watcher

1. Open the MesBrowser tool from GTM Launcher.
1. Find your Asset (Computer Name) under GTM >Manufacturing > Assets.
1. Directly under your asset, create the following key/value:

```
      GTM
      - Manufacturing
        - Assets
          - YourMachine
            wsHost: ws://<testplan editor web service>/subscriptions
```

1. (Optional) To enable debugging information create the following key/value alongside the wsHost:

```
    wsDebug: true
```

An example of the URL passed into wsHost:

```
     ws://c-it001-46631.gentex.com:3001/subscriptions
```

Notice the use of the port value in the URL. Here is a list of example assets that have been set up in MES Registry:

      - GTM/Manufacturing/Assets/C-5383
      - GTM/Manufacturing/Assets/C-6988
      - GTM/Manufacturing/Assets/C-IT001-46631

Some of these assets have been set up to use common values from MES Registry. These are formatted with \${KeyName}. See the common key name reference above for details.

### Test Station 2

1. Open the MesBrowser tool from GTM Launcher.
1. Find your Asset (Computer Name) under:

```
GTM > Manufacturing > Assets > YourComputer > Stations > StationName
```

1. Create the following key/value:

```
      GTM
      - Manufacturing
        - Assets
          - YourMachine
            - Stations
              - YourStationName
                wsHost: ws://<testplan editor web service>/subscriptions
```

1. (Optional) To enable debugging information create the following key/value alongside the wsHost:

```
    wsDebug: true
```

Examples in the MES Registry:

- GTM/Manufacturing/Assets/C-6988/Stations/DBG_ST1

## Running a Test Plan

### Launch the Station Watcher / Test Station.

1. On the machine where the testing occurs: Start the Station Watcher tool from the MesBrowser tool (found in GTM Launcher).

### Set the Target Station Watcher

1. From anywhere: Open the Test Plan Editor web application and navigate to the test plan you want to run.
1. Once the TestPlan is loaded click on the "EXECUTE" tab at the bottom to maximize the execution bar.
1. Click on the Computer Icon to the right to get a list of currently running Station Watchers.
1. Select the Station Watcher that was launched on the Tester. If this is done correctly there will be a Chip that shows up at the top displaying the current target Station Watcher.
1. After choosing the Station Watcher close the Execution Bar and re-open it. This will put the system in the original state.

### Running the Test Plan

1. Open the execution bar.
1. At this point the tool is generating code and sending it to the Test Station. The waiting indicator should be visible next to the Select/Execute toggle. Wait until the test plan has been fully loaded (and the waiting indicator stops).
1. Checkboxes should now be available on elements in the Test Plan. Select the indexes that should be run.
1. Hit the Play Button to run them.

## Errors in Execution

When errors occur in execution a new button should become visible showing a red exclamation mark. If the button is clicked the user is shown a list of errors that occurred while attempting to execute the test plan.

## Using WSL2 as Server

### Obtain IP Address in WSL2 Ubuntu

There's a small fix that needs to be applied if running a development service from inside WSL2. From inside of WSL2 Ubuntu:

`ip addr | grep eth0 | grep inet`

Inside of this there should be a device called `eth0`, use the value immediately to the right of the inet string:

`inet 172.26.196.85/20 brd 172.26.207.255 scope global eth0`

The IP Address in this case is 172.26.196.85.

### Setup Port Forwards

From the host machine, run PowerShell as Administrator. Now execute the following, replacing the `IP_OF_WSL2` with the IP Address above:

```
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=IP_OF_WSL2
New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort 3001 -Action Allow -Protocol TCP
New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort 3001 -Action Allow -Protocol TCP
```

This will successfully set the port forward up.
