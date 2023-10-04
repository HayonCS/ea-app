FROM elleflorio/svn-server:latest

# This makes a subversion user with the username "user" and password "password"
COPY passwd /etc/subversion/passwd

# Setup WebDAV
COPY dav_svn.conf /etc/apache2/conf.d/dav_svn.conf

COPY subversion-access-control /etc/subversion/subversion-access-control
