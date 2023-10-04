# Docker on WSL2

<style>
table {
	background: white;
	border: 1px solid black;
	border-spacing: 0px;
}
th {
	background: #0d51a6;
	color: white;
	border-spacing: 0px;
}
tr {
	color: black;
	border-spacing: 0px;
} 
tr:nth-child(2n) {
	color: black;
	background: #f6f3e7;
	border-spacing: 0px;
} 
</style>

## Introduction

This document covers the instructions for running TPE containers without Docker Desktop and only using WSL2 and the Docker Engine on Linux.

| System        | Description                                                                                                                                         | How to Access                          |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------- |
| **Host**      | This is your "host" machine, the place where the base repo has been cloned.                                                                         | PowerShell                             |
| **WSL2**      | This is a "Linux-on-Windows" environment. The host file system can be accessed from WSL2; however the network is not bridged with the host network. | Windows Terminal / WSL tool in Windows |
| **Container** | This is the Docker container inside of the WSL2 environment.                                                                                        | VSCode / docker / docker-compose       |

### Docker Installation

1. Open a WSL2 command prompt.
2. Run the following commands:

```
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose
sudo docker run hello-world
```

3. At this point, the system may respond with:

```
docker: Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?
```

4. (OPTIONAL) Set up group/run permissions:

```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

### Docker Daemon Start

Inside of WSL2, manually start the docker daemon:

```
sudo service docker start
```

### Docker Compose

Have the TPE code checked out someplace relative to the C: drive. For example on the Host (PowerShell):

```
    cd \
    mkdir dev
    cd dev
    git clone <url of tpe> tpe
```

After checking this out, log into WSL. Note that the Docker Daemon should have been started. Run the following:

```
cd /mnt/c/dev/tpe
docker-compose up -d
```

That will build and bring the TPE image up. At this point, follow the default instructions on initializing the TPE app.

## WSL2 Reference

This section covers some of the common things you might want to do with WSL2. All of the instructions listed here should be done in PowerShell (i.e. from the **Host** system).

### List WSL2 Environments

The following command will list the WSL2 environments:

```
wsl -l -v
```

It should come back with something that looks like this:

```
  NAME            STATE           VERSION
* Ubuntu-20.04    Running         2
  Ubuntu-18.04    Stopped         1
```

In this case, Ubuntu-20.04 is the default platform that will be launched when entering the WSL environment. The second column states whether or not this is running. The third column is what version of WSL is used.

### Change the WSL Version for a Platform

```
wsl --set-version Ubuntu-20.04 2
```

This would end up changing the Ubuntu-20.04 to WSL 2. If wanting to use WSL 1, the following command could be used:

```
wsl --set-version Ubuntu-20.04 1
```

### Set Default WSL Version

When launching a WSL, this command will set the default version to be launched.

```
wsl --set-default-version 2
```

## Port Forwarding with WSL2

### Why is Port Forwarding Needed?

Port Forwarding is required for users that want to expose ports from docker to the outside world. Here is a real-life example of when this is required:

    * Bob is running a web server inside of WSL on port 5000.
    * Bob's host machine is at:  machine1.bobs_burgers.com
    * Linda wants to see Bob's development website. She first tries: http://machine1.bobs_burgers.com:5000 and has no success.

The reason this is happening to Linda is that Bob's WSL Docker instance has ports that are available to his local machine but are not forwarded outside. Any outside connection cannot by default access ports opened inside of WSL containers (despite the local machine being able to do so). Users can run a few quick PowerShell commands to set up a scheme where ports are forwarded from the host into the WSL container. For simplicity our team has a script to forward the most popular ports.

### When Does the Port Forwarding Script Need to be Run?

The main condition when the port forwarding script will need to be run is when your WSL Container is restarted. Each time the WSL container restarts it is acquiring a new internal IP Address (normally 172.X.Y.Z). When this happens the previous port forwards that were set up will be invalid.

### How to Run the Port Forwarding Script

Port forwarding with WSL2 is done via a script located in:

     `%TPE_APP%/scripts/wsl_port_forwarding.py`

The running of this script is done on the HOST machine. The HOST machine is the machine where we run docker-compose. This script will need to be run as an administrator. Suggestion would be to follow these steps:

    1. In the Windows Start menu, search for PowerShell and right click on it, select Run As Administrator.
    2. In the PowerShell window, type the following (replacing TPE_DIRECTORY with your own location for the TPE app):
        ```
        cd %TPE_APP%
        python .\scripts\wsl_port_forwarding.py
        ```
    3. If this successfully runs, the user should see the following:

```
IS ADMIN: True
REMOVING RULE(0.0.0.0:80 --> 172.21.237.41:80)
REMOVING RULE(0.0.0.0:443 --> 172.21.237.41:443)
REMOVING RULE(0.0.0.0:3633 --> 172.21.237.41:3633)
REMOVING RULE(0.0.0.0:4101 --> 172.21.237.41:4101)
REMOVING RULE(0.0.0.0:4102 --> 172.21.237.41:4102)
REMOVING RULE(0.0.0.0:10501 --> 172.21.237.41:10501)
REMOVING RULE(0.0.0.0:9001 --> 172.30.89.12:9001)
REMOVING RULE(0.0.0.0:1433 --> 172.30.89.12:1433)
REMOVING RULE(0.0.0.0:3001 --> 172.24.137.58:3001)
REMOVING RULE(0.0.0.0:3000 --> 172.30.89.12:3000)
REMOVING RULE(0.0.0.0:5000 --> 172.30.89.12:5000)
REMOVING RULE(10.48.XX.YYY:5000 --> 172.24.137.58:5000)
Removed 12 rules.
Host IP Address --> 10.48.XX.YYY
WSL IP Address --> 192.168.ZZZ.123

ADDING PF RULE(10.48.XX.YYY:3000 --> 192.168.161.138:3000)
ADDING PF RULE(10.48.XX.YYY:3001 --> 192.168.161.138:3001)
ADDING PF RULE(10.48.XX.YYY:6379 --> 192.168.161.138:6379)
ADDING PF RULE(10.48.XX.YYY:1433 --> 192.168.161.138:1433)
Adding Inbound Exception For Port --> 3000
Adding Outbound Exception For Port --> 3000
Adding Inbound Exception For Port --> 3001
Adding Outbound Exception For Port --> 3001
Adding Inbound Exception For Port --> 1433
Adding Outbound Exception For Port --> 1433
Adding Inbound Exception For Port --> 6379
Adding Outbound Exception For Port --> 6379
```

## WSL2 Considerations

Not all behavior has been preserved from Docker Desktop. Here's a list of some of the differences/considerations:

### Microsoft SQL Server Management Studio 18

`localhost` could be used as the sql-server location when images were run via Docker Desktop. Whereas when running directly from WSL2 this is no longer an option. The reason this does not work is WSL2 sets up a completely private network under the hood that is not bridged with the host network. There are a couple of options for workarounds:

- From the Docker Container, mssql-cli still works because this is all taking place from within WSL2's domain.
- A second option:

  1. In WSL Terminal, execute:

```
   ifconfig | grep -A1 eth0
```

2. The results should look like this:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.84.233  netmask 255.255.240.0  broadcast 192.168.95.255
```

3. Use the inet address in the Microsoft SQL Server Management Studio 18 location instead of localhost.

### Addresses In Container

Part of the .env involves listing addresses to popular endpoints. One example is:

```
MES_SECURITY_ENDPOINT=http://zvm-msgprod/SecurityWeb/api/v1/
MES_USER_PICTURE=https://api.gentex.com/user/image/v1/
MES_EMPLOYEE_DIRECTORY=https://api.gentex.com/employeedemo/v1/employees/
```

In this case, the `MES_SECURITY_ENDPOINT` will not be hit because `http://zvm-msgprod/` is not fully qualified with `.gentex.com`. This is again because WSL2 is working in its own private network.
